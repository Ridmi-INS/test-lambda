import {
    associateRolePermissions,
    createRole,
    getAuth0Token,
    getResourceServerById,
    getRolePermissions,
    getRoles,
    removeRolePermissions,
    updateResourceServer,
    updateRole,
} from '../../auth0Wrappers';
import { setTimeout } from 'node:timers/promises';
import {
    fromAuth0GetPermissions,
    fromAuth0Role,
    toAuth0Permission,
} from '../../conversions';
import { Auth0Context, Permission, Role } from '../../types';
import { IAuth0Repo } from './IAuth0Repo';

export class Auth0RepoImpl implements IAuth0Repo {
    private ctx: Auth0Context;

    private timeout?: Promise<void> = undefined;

    constructor(ctx: Auth0Context) {
        this.ctx = ctx;
    }

    private updateAuth0MgmtTokenIfUndefined = async () => {
        if (this.ctx.mgmtToken !== undefined) {
            return;
        }

        // copy the context for test reasons
        // otherwise the tests can't tell the difference between the
        // context used as argument to `getAuth0Token`, and the resulting
        // context after running a method
        try {
            this.ctx.mgmtToken = await getAuth0Token({ ...this.ctx });
        } catch (err) {
            this.ctx.logger.error(
                { err },
                `Got error updating Auth0 management token`,
            );
            throw err;
        }
    };

    private prepareToRequest = async () => {
        await this.updateAuth0MgmtTokenIfUndefined();

        // await any current timeout that exists, and when that's done,
        // set a new one for the next request
        await this.timeout;
        this.timeout = setTimeout(this.ctx.config.rateLimitMs);
    };

    public getAllPermissions = async (
        resourceServerId?: string,
    ): Promise<Array<Permission>> => {
        await this.prepareToRequest();

        try {
            const result = await getResourceServerById(
                this.ctx,
                resourceServerId ?? this.ctx.config.resourceServerId,
            );

            // coincidentally, the scopes returned in the body are the exact same
            // schema as domain model scopes, so no conversion necessary here
            return result.body.scopes;
        } catch (err) {
            this.ctx.logger.error(
                { err },
                `Got error getting Auth0 resource server by ID`,
            );
            throw err;
        }
    };

    public pushPermissions = async (
        permissions: Array<Permission>,
        resourceServerId?: string,
    ): Promise<Array<Permission>> => {
        if (permissions.length === 0) {
            throw new Error("permissions array can't be empty");
        }

        await this.prepareToRequest();

        try {
            // coincidentally, the scopes expected in the request body are the
            // exact same schema as domain model permissions, so no conversion
            // necessary
            const result = await updateResourceServer(
                this.ctx,
                resourceServerId ?? this.ctx.config.resourceServerId,
                {
                    scopes: permissions,
                },
            );

            return result.body.scopes;
        } catch (err) {
            this.ctx.logger.error(
                { permissions, err },
                `Got error pushing permissions to Auth0`,
            );
            throw err;
        }
    };

    public getAllRoleNames = async (): Promise<Map<string, Role>> => {
        await this.prepareToRequest();
        try {
            const result = await getRoles(this.ctx);
            return new Map(
                result.body.roles.map((role) => [
                    role.name,
                    fromAuth0Role(role),
                ]),
            );
        } catch (err) {
            this.ctx.logger.error(
                { err },
                `Got error pushing permissions to Auth0`,
            );
            throw err;
        }
    };

    public pushRole = async (role: Role): Promise<Required<Role>> => {
        await this.prepareToRequest();

        try {
            const result = await (role.auth0Id ?
                updateRole(
                    this.ctx,
                    {
                        name: role.name,
                        description: role.description,
                    },
                    role.auth0Id,
                )
            :   createRole(this.ctx, {
                    name: role.name,
                    description: role.description,
                }));

            return fromAuth0Role(result.body);
        } catch (err) {
            this.ctx.logger.error(
                { role, err },
                `Got error pushing a role to Auth0`,
            );
            throw err;
        }
    };

    public getRolePermissions = async (
        roleAuth0Id: string,
    ): Promise<Array<Permission>> => {
        await this.prepareToRequest();
        try {
            const result = await getRolePermissions(this.ctx, roleAuth0Id);
            return fromAuth0GetPermissions(result.body);
        } catch (err) {
            this.ctx.logger.error(
                { err },
                `Got error getting permissions for role ${roleAuth0Id} from Auth0`,
            );
            throw err;
        }
    };

    public associateRolePermissions = async (
        roleAuth0Id: string,
        permissionNames: Array<string>,
        resourceServerId?: string,
    ): Promise<void> => {
        if (permissionNames.length === 0) {
            throw new Error(
                'no permission names passed to associateRolePermissions',
            );
        }

        await this.prepareToRequest();

        try {
            await associateRolePermissions(this.ctx, roleAuth0Id, {
                permissions: permissionNames.map((name: string) =>
                    toAuth0Permission(
                        name,
                        resourceServerId ?? this.ctx.config.resourceServerId,
                    ),
                ),
            });
        } catch (err) {
            this.ctx.logger.error(
                { permissionNames, resourceServerId, err },
                `Got error associating role ${roleAuth0Id} with permissions in Auth0`,
            );
            throw err;
        }
    };

    public removeRolePermissions = async (
        roleAuth0Id: string,
        permissionNames: Array<string>,
        resourceServerId?: string,
    ): Promise<void> => {
        if (!this.ctx.config.shouldRemovePermissions) {
            throw new Error(
                'removeRolePermissions was called, but we are not configured to remove permissions',
            );
        }
        if (permissionNames.length === 0) {
            throw new Error('no permission names to remove');
        }

        await this.prepareToRequest();

        try {
            await removeRolePermissions(this.ctx, roleAuth0Id, {
                permissions: permissionNames.map((name: string) =>
                    toAuth0Permission(
                        name,
                        resourceServerId ?? this.ctx.config.resourceServerId,
                    ),
                ),
            });
        } catch (err) {
            this.ctx.logger.error(
                { permissionNames, resourceServerId, err },
                `Got error removing permission assignments from a role ${roleAuth0Id} in Auth0`,
            );
            throw err;
        }
    };
}
