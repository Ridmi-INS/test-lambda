import * as yup from 'yup';
import { DEFAULT_STRING_MAX_LENGTH } from './constants';

const EXCEPTIONS: Array<string> = ['organisation.admin:staffs:view'];

export const permissionNameValidator = yup
    .string()
    .defined()
    .test(
        'is-valid-or-predefined',
        '"${value}" is not a valid permission name, nor is it predefined exception',
        (value) =>
            Boolean(
                EXCEPTIONS.includes(value) ||
                value.match(/^([a-zA-Z-]+:)+([a-zA-Z-])+$/),
            ),
    )
    .max(DEFAULT_STRING_MAX_LENGTH);
