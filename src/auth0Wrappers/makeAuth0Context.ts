import pino from 'pino';
import { Auth0Config, Auth0Context } from '../types';

export const makeAuth0Context = (
    config: Auth0Config,
    requestId: string,
): Auth0Context => ({
    config,
    logger: pino({
        mixin: () => ({ requestId: requestId }),
    }),
    mgmtToken: undefined,
});
