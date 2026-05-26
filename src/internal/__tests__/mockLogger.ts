import { Logger } from 'pino';

export const mockLogger = (): Logger =>
    ({
        info: jest.fn(),
        trace: jest.fn(),
        debug: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        level: 'silent',
        fatal: jest.fn(),
        silent: jest.fn(),
        msgPrefix: 'unittest',
    }) as unknown as Logger;
