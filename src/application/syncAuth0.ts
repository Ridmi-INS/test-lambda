import { IAuth0Repo } from '../persistence';
import {
    AuthDeclaration,
    RolesToModify,
    Role,
    PartialRolesToModify,
    RolePermissionsToModify,
    Auth0Context,
} from '../types';
import { findArrayDifferences } from '../util';

type Deps = {
    ctx: Auth0Context;
    repo: IAuth0Repo;
};

const syncAuth0Role = async (
    authDeclaration: AuthDeclaration,
    existingRolesMap: Map<string, Role>,
    repo: IAuth0Repo,
): Promise<RolesToModify> => {
    const rolesToModify: PartialRolesToModify = Object.entries(
        authDeclaration.rolePermissions,
    ).map(([name, { description, permissions }]) => ({
        role: { name, description },
        existingRole: existingRolesMap.get(name),
        permissions,
    }));
    // rate limiting will automatically be applied within the repo, so
    // Promise.all is fine
    return await Promise.all(
        rolesToModify.map(async ({ role, existingRole, permissions }) => {
            const resultingRole = await repo.pushRole({
                auth0Id: existingRole?.auth0Id,
                name: role.name,
                description: role.description,
            });

            return {
                role: resultingRole,
                existingRole,
                permissions,
            };
        }),
    );
};

export const syncAuth0 = async (
    authDeclaration: AuthDeclaration,
    { ctx, repo }: Deps,
) => {
    ctx.logger.debug('About to update Auth0 permissions');

    // 1. Add permissions to Auth0 that aren't already there
    const resultingPermissions = await repo.pushPermissions(
        authDeclaration.permissions,
    );

    ctx.logger.info(
        { inputPermissions: authDeclaration.permissions, resultingPermissions },
        `Updated Auth0 permissions`,
    );

    // 2. Add roles to Auth0 that aren't already there
    const existingRolesMap = await repo.getAllRoleNames();
    const rolesToModify = await syncAuth0Role(
        authDeclaration,
        existingRolesMap,
        repo,
    );
    ctx.logger.info({ rolesToModify }, `Updated or created these roles`);

    // 3. Add associations between roles and permissions that aren't already there
    // first, get the existing permissions for each role
    const rolePermissionsToModifyUnfiltered: RolePermissionsToModify =
        await Promise.all(
            rolesToModify.map(async ({ role, permissions }) => {
                const existingPermissions = await repo.getRolePermissions(
                    role.auth0Id,
                );
                const permissionDiffs = findArrayDifferences(
                    existingPermissions.map(({ value }) => value),
                    permissions,
                    (val) => val,
                );
                return {
                    role,
                    permissionDiffs,
                };
            }),
        );
    const rolePermissionsToModify: RolePermissionsToModify =
        rolePermissionsToModifyUnfiltered.filter(
            ({ permissionDiffs }) =>
                permissionDiffs.added.length > 0 ||
                permissionDiffs.removed.length > 0,
        );
    ctx.logger.info(
        { rolePermissionsToModify },
        `About to try modify these role permission assignments`,
    );

    await Promise.all(
        rolePermissionsToModify.map(async ({ role, permissionDiffs }) => {
            if (permissionDiffs.removed.length > 0) {
                await repo.removeRolePermissions(
                    role.auth0Id,
                    permissionDiffs.removed,
                );
            }
            if (permissionDiffs.added.length > 0) {
                await repo.associateRolePermissions(
                    role.auth0Id,
                    permissionDiffs.added,
                );
            }
        }),
    );

    ctx.logger.info(
        `Successfully removed or associated permissions from roles`,
    );
};
