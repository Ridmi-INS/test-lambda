import { Auth0GetPermissions, Permission } from '../../types';

export const fromAuth0GetPermissions = (
    response: Auth0GetPermissions,
): Array<Permission> =>
    response.permissions.map(({ permission_name, description }) => ({
        value: permission_name,
        description,
    }));
