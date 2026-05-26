import { Role } from './Role';

export type RolesToModify = Array<{
    role: Required<Role>;
    existingRole?: Role;
    permissions: Array<string>;
}>;
