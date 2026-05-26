import { Permission } from './Permission';
import { RolePermissions } from './RolePermissions';

export type AuthDeclaration = {
    rolePermissions: RolePermissions;
    // at the moment we only have one resource server. If in future we have
    // multiple, we can switch from Array to a Record of permissions for each
    // resource server ID
    permissions: Array<Permission>;
};
