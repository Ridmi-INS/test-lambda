import * as yup from 'yup';
import { AuthDeclaration } from '../types';
import { rolePermissionsValidator } from './rolePermissionsValidator';
import { permissionValidator } from './permissionValidator';
import { DEFAULT_ARRAY_MAX_LENGTH } from './constants';

export const authDeclarationValidator: yup.ObjectSchema<AuthDeclaration> = yup
    .object({
        rolePermissions: rolePermissionsValidator,
        permissions: yup
            .array()
            .of(permissionValidator)
            .max(DEFAULT_ARRAY_MAX_LENGTH)
            .defined(),
    })
    .exact();
