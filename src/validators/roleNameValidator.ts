import * as yup from 'yup';
import { DEFAULT_STRING_MAX_LENGTH } from './constants';
import { permissionNameValidator } from './permissionNameValidator';

const EXCEPTIONS: Array<string> = ['organisation.admin:staffs'];

export const roleNameValidator = yup
    .string()
    .defined()
    .test(
        'is-valid-or-permission-name',
        '"${value}" is not a valid role name, not a permission name, or not one of the predefined exceptions',
        (value) =>
            Boolean(
                value.match(/^[A-Z_]+$/) ||
                EXCEPTIONS.includes(value) ||
                permissionNameValidator.isValidSync(value),
            ),
    )
    .max(DEFAULT_STRING_MAX_LENGTH);
