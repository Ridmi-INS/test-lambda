import { Auth0Role } from '../Auth0Role';

export type Auth0GetRoles = {
    start: number;
    limit: number;
    total: number;
    roles: Array<Auth0Role>;
};
