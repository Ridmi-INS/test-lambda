import * as yup from 'yup';
import { Auth0GetPermissions } from '../../types';
import { auth0GenericListValidator } from './auth0GenericListValidator';

export const auth0GetPermissionsValidator: yup.ObjectSchema<Auth0GetPermissions> =
    auth0GenericListValidator<Pick<Auth0GetPermissions, 'permissions'>>(
        yup
            .object({
                resource_server_identifier: yup.string().defined(),
                permission_name: yup.string().defined(),
                resource_server_name: yup.string().defined(),
                description: yup.string().defined(),
            })
            .exact(),
        'permissions',
    ).exact();
