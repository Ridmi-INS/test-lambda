// there are a lot more fields in the response object, I'm only including
// the ones I'm using. See here for a full list:

import { Auth0ResourceServerPermission } from '../Auth0ResourceServerPermission';

// there are a lot more fields in the response object, I'm only including
// the ones I'm using. See here for a full list:
// https://auth0.com/docs/api/management/v2/resource-servers/get-resource-servers-by-id
export type Auth0GetResourceServerById = {
    id: string;
    name: string;
    identifier: string;
    scopes: Array<Auth0ResourceServerPermission>;
};
