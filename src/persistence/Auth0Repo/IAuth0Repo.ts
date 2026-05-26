import { Permission, Role } from '../../types';

export type IAuth0Repo = {
    getAllPermissions(resourceServerId?: string): Promise<Array<Permission>>;
    pushPermissions(
        permissions: Array<Permission>,
        resourceServerId?: string,
    ): Promise<Array<Permission>>;
    /**
     * Key in returned map is the role name
     */
    getAllRoleNames(): Promise<Map<string, Role>>;
    pushRole(role: Role): Promise<Required<Role>>;
    getRolePermissions(roleAuth0Id: string): Promise<Array<Permission>>;
    associateRolePermissions(
        roleAuth0Id: string,
        permissionNames: Array<string>,
    ): Promise<void>;
    removeRolePermissions(
        roleAuth0Id: string,
        permissionNames: Array<string>,
    ): Promise<void>;
};
