/* eslint-disable no-magic-numbers */
/* Magic numbers make sense for default values here */
import { IGetConfigFn } from './IGetConfigFn';
import {
    getBooleanConf,
    getIntegerConf,
    getStringConf,
} from './configFromEnvUtils';

export const getConfigFromEnv: IGetConfigFn = () => ({
    url: getStringConf('AUTH0_URL', ''),
    audience: getStringConf('AUTH0_AUDIENCE', ''),
    clientId: getStringConf('AUTH0_CLIENT_ID', ''),
    clientSecret: getStringConf('AUTH0_CLIENT_SECRET', ''),
    resourceServerId: getStringConf('AUTH0_RESOURCE_SERVER_ID', ''),
    rateLimitMs: getIntegerConf('AUTH0_RATE_LIMIT_MS', 400),
    shouldRemovePermissions: getBooleanConf(
        'AUTH0_SHOULD_REMOVE_PERMISSIONS',
        false,
    ),
});
