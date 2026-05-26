import pino from 'pino';
import { Auth0Config } from '../../types';
import { makeAuth0Context } from '../makeAuth0Context';

jest.mock('pino');

const mockPino = pino as unknown as jest.Mock;

describe('makeAuth0Context', () => {
    it('creates an auth0 context from a config', () => {
        mockPino.mockReturnValueOnce('dummyLogger');
        expect(
            makeAuth0Context({ url: 'abc' } as Auth0Config, 'requestId'),
        ).toEqual({
            config: {
                url: 'abc',
            },
            logger: 'dummyLogger',
            mgmtToken: undefined,
        });
        expect(mockPino).toHaveBeenCalledTimes(1);
        expect(mockPino).toHaveBeenCalledWith({
            mixin: expect.any(Function),
        });
    });
});
