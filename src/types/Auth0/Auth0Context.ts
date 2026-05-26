import { Logger as PinoLogger } from 'pino';
import { Auth0Config } from './Auth0Config';

export type Auth0Context = {
    mgmtToken: string | undefined;
    config: Auth0Config;
    logger: PinoLogger;
};
