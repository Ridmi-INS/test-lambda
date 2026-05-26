import { Auth0ResourceServerPermission } from '../Auth0ResourceServerPermission';

export type Auth0UpdateResourceServerRequestBody = {
    scopes: Array<Auth0ResourceServerPermission>;
};
