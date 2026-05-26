import { Role } from './Role';

/**
 * This is for inputs where we might be creating roles
 * hence the main "role" member does not require auth0ID
 */
export type PartialRolesToModify = Array<{
    role: Role;
    existingRole?: Role;
    permissions: Array<string>;
}>;
