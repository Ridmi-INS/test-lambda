import { Auth0GetResourceServerById } from './Auth0GetResourceServerById';

export type Auth0GetResourceServers = {
    start: number;
    limit: number;
    total: number;
    // https://auth0.com/docs/api/management/v2/resource-servers/get-resource-servers
    resource_servers: Array<Auth0GetResourceServerById>;
};
