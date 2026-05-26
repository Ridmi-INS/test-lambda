import axios from 'axios';
import { Auth0Context } from '../types';
import { Auth0ResponseValidationError } from './auth0Request';

/**
 * Gets a new auth0 token
 */
export const getAuth0Token = async (ctx: Auth0Context): Promise<string> => {
    const options = {
        method: 'POST',
        url: `https://${ctx.config.url}/oauth/token`,
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: ctx.config.clientId,
            client_secret: ctx.config.clientSecret,
            audience: `https://${ctx.config.url}/api/v2/`,
        }),
    };

    ctx.logger.debug(
        { options },
        `About to get Auth0 token with these request options`,
    );

    const response = await axios.request(options);
    if (response.data && 'access_token' in response.data) {
        return response.data.access_token;
    }

    ctx.logger.error(
        { response },
        `Could not find access token in this response`,
    );
    throw new Auth0ResponseValidationError(
        'Could not find access token in responseto get Auth0 management token API',
    );
};
