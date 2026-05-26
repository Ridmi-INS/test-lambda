import { ArrayDifferences } from '../../util';
import { Role } from './Role';

export type RolePermissionsToModify = Array<{
    role: Required<Role>;
    permissionDiffs: ArrayDifferences<string>;
}>;
