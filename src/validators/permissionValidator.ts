import * as yup from 'yup';
import { Permission } from '../types';
import { permissionNameValidator } from './permissionNameValidator';
import { DEFAULT_STRING_MAX_LENGTH } from './constants';

export const permissionValidator: yup.ObjectSchema<Permission> = yup.object({
    value: permissionNameValidator,
    description: yup.string().max(DEFAULT_STRING_MAX_LENGTH).defined(),
});
