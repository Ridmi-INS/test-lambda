import * as yup from 'yup';
import { permissionNameValidator } from './permissionNameValidator';
import { roleNameValidator } from './roleNameValidator';
import { RolePermissions } from '../types';
import {
    DEFAULT_STRING_MAX_LENGTH,
    DEFAULT_ARRAY_MAX_LENGTH,
    MAX_ROLES,
} from './constants';

const mapRules = <T>(
    // one of the very rare cases where the type actually is 'any'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    map: any,
    rule: T,
): Record<string, T> =>
    map && typeof map === 'object' && Object.keys(map).length < MAX_ROLES ?
        Object.keys(map).reduce((newMap, key) => {
            if (roleNameValidator.isValidSync(key)) {
                return { ...newMap, [key]: rule };
            } else {
                return newMap;
            }
        }, {})
    :   {};

const dynamicKeyValueValidator: yup.ObjectSchema<RolePermissions[string]> = yup
    .object({
        description: yup.string().max(DEFAULT_STRING_MAX_LENGTH).defined(),
        permissions: yup
            .array()
            .of(permissionNameValidator)
            .max(DEFAULT_ARRAY_MAX_LENGTH)
            .defined(),
    })
    .exact();

// rolePermissions includes dynamic keys and values, which we still want to validate
// so we use yup.lazy to create a dynamic object validator based on the input
// keys
export const rolePermissionsValidator: yup.ObjectSchema<RolePermissions> =
    yup.lazy((map) =>
        yup.object(mapRules(map, dynamicKeyValueValidator)).exact(),
    ) as unknown as yup.ObjectSchema<RolePermissions>;
