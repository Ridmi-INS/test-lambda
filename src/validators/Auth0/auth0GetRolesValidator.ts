import * as yup from 'yup';
import { Auth0GetRoles } from '../../types';
import { auth0RoleValidator } from './auth0RoleValidator';
import { auth0GenericListValidator } from './auth0GenericListValidator';

export const auth0GetRolesValidator: yup.ObjectSchema<Auth0GetRoles> =
    auth0GenericListValidator<Pick<Auth0GetRoles, 'roles'>>(
        auth0RoleValidator,
        'roles',
    ).exact();
