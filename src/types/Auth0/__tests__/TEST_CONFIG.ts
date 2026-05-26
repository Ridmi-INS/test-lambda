import { Auth0Config } from '../Auth0Config';

// using functions for these constants to avoid accidentally mutating them
export const TEST_CONFIG = (
    shouldRemovePermissions: boolean = false,
): Auth0Config => ({
    url: 'abcurl',
    audience: 'audie',
    clientId: 'cid',
    clientSecret: 'cs',
    resourceServerId: 'rsid',
    rateLimitMs: 123,
    shouldRemovePermissions,
});
