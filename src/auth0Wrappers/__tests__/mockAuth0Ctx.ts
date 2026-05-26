import pino from 'pino';
import { Auth0Config } from '../../types';

export const mockAuth0Ctx = {
    config: {
        url: 'abcurl',
        clientId: 'cid',
        clientSecret: 'cs',
    } as Auth0Config,
    mgmtToken: undefined,
    logger: pino({ level: 'silent' }),
};
