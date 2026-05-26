import * as yup from 'yup';
import { DEFAULT_ARRAY_MAX_LENGTH } from '../constants';

/**
 * Creates a validator for a list of items following a schema that's used across
 * many Auth0 endpoints. This isn't perfect types-wise and might not handle
 * edge cases like when there are multiple keys in T, so just avoid those
 * scenarios when u use it pls.
 */
export const auth0GenericListValidator = <
    T extends Record<string, Array<yup.AnyObject>>,
>(
    elements: yup.ObjectSchema<T[string][number]>,
    listKeyName: keyof T,
): yup.ObjectSchema<
    {
        start: number;
        limit: number;
        total: number;
    } & T
> =>
    yup.object({
        start: yup.number().integer().defined(),
        limit: yup.number().integer().defined(),
        total: yup.number().integer().defined(),
        [listKeyName]: yup.array().of(elements).max(DEFAULT_ARRAY_MAX_LENGTH),
    }) as yup.ObjectSchema<{ start: number; limit: number; total: number } & T>;
