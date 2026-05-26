import {
    Auth0Context,
    Auth0GetPermissions,
    Auth0GetRoles,
    Auth0PermissionsAssign,
    Auth0Role,
    Auth0RoleCreate,
    Auth0RoleUpdate,
    BodyWithStatus,
} from '../types';
import { auth0Request } from './auth0Request';
import {
    auth0GetRolesValidator,
    auth0RoleValidator,
    emptyValidator,
} from '../validators';
import { auth0GetPermissionsValidator } from '../validators/Auth0/auth0GetPermissionsValidator';
import { Empty } from '../types/Auth0/responses/Empty';

export const getRoles = async (
    ctx: Auth0Context,
): Promise<BodyWithStatus<Auth0GetRoles>> =>
    auth0Request(
        ctx,
        {
            body: auth0GetRolesValidator,
        },
        `${ctx.config.url}/api/v2/roles?per_page=100&include_totals=true`,
        'GET',
    );

export const createRole = async (
    ctx: Auth0Context,
    data: Auth0RoleCreate,
): Promise<BodyWithStatus<Auth0Role>> =>
    auth0Request(
        ctx,
        {
            body: auth0RoleValidator,
        },
        `${ctx.config.url}/api/v2/roles`,
        'POST',
        data,
    );

export const updateRole = async (
    ctx: Auth0Context,
    data: Auth0RoleUpdate,
    id: string,
): Promise<BodyWithStatus<Auth0Role>> =>
    auth0Request(
        ctx,
        {
            body: auth0RoleValidator,
        },
        `${ctx.config.url}/api/v2/roles/${id}`,
        'PATCH',
        data,
    );

export const getRolePermissions = async (
    ctx: Auth0Context,
    roleId: string,
): Promise<BodyWithStatus<Auth0GetPermissions>> =>
    auth0Request(
        ctx,
        {
            body: auth0GetPermissionsValidator,
        },
        `${ctx.config.url}/api/v2/roles/${roleId}/permissions?include_totals=true`,
    );

export const associateRolePermissions = async (
    ctx: Auth0Context,
    roleId: string,
    data: Auth0PermissionsAssign,
): Promise<BodyWithStatus<Empty>> =>
    auth0Request(
        ctx,
        {
            body: emptyValidator,
        },
        `${ctx.config.url}/api/v2/roles/${roleId}/permissions`,
        'POST',
        data,
    );

export const removeRolePermissions = async (
    ctx: Auth0Context,
    roleId: string,
    data: Auth0PermissionsAssign,
): Promise<BodyWithStatus<Empty>> =>
    auth0Request(
        ctx,
        {
            body: emptyValidator,
        },
        `${ctx.config.url}/api/v2/roles/${roleId}/permissions`,
        'DELETE',
        data,
    );
