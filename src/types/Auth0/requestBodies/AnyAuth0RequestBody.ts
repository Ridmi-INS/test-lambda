import {
    Auth0GetResourceServerById,
    Auth0GetResourceServers,
} from '../responses';
import { Auth0PermissionsAssign } from './Auth0PermissionsAssign';
import { Auth0RoleCreate } from './Auth0RoleCreate';
import { Auth0RoleUpdate } from './Auth0RoleUpdate';
import { Auth0UpdateResourceServerRequestBody } from './Auth0UpdateResourceServerRequestBody';

export type AnyAuth0RequestBody =
    | Auth0RoleCreate
    | Auth0RoleUpdate
    | Auth0PermissionsAssign
    | Auth0GetResourceServerById
    | Auth0GetResourceServers
    | Auth0UpdateResourceServerRequestBody;
