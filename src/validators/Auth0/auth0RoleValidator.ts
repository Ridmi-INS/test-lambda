import * as yup from 'yup';
import { Auth0Role } from '../../types';

export const auth0RoleValidator: yup.ObjectSchema<Auth0Role> = yup
    .object({
        id: yup.string().defined(),
        name: yup.string().defined(),
        description: yup.string().defined(),
    })
    .exact();
