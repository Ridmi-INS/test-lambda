export type Auth0Config = {
    url: string;
    audience: string;
    clientId: string;
    clientSecret: string;
    resourceServerId: string;
    rateLimitMs: number; // rate limit in ms
    shouldRemovePermissions: boolean;
};
