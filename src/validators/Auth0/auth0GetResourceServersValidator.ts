import * as yup from 'yup';
import { Auth0GetResourceServers } from '../../types';
import { auth0GenericListValidator } from './auth0GenericListValidator';
import { auth0GetResourceServerByIdValidator } from './auth0GetResourceServerByIdValidator';

export const auth0GetResourceServersValidator: yup.ObjectSchema<Auth0GetResourceServers> =
    auth0GenericListValidator<
        Pick<Auth0GetResourceServers, 'resource_servers'>
    >(auth0GetResourceServerByIdValidator, 'resource_servers').exact();
