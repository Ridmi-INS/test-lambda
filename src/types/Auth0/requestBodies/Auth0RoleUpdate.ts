import { Auth0Role } from '../Auth0Role';

export type Auth0RoleUpdate = Omit<Auth0Role, 'id'>;
