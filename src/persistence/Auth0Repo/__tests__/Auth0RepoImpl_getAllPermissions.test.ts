/* eslint-disable no-magic-numbers */
import { setTimeout } from 'node:timers/promises';
import { getAuth0Token, getResourceServerById } from '../../../auth0Wrappers';
import { Auth0RepoImpl } from '../Auth0RepoImpl';
import { makeTestContext } from './testConstants';
import { TEST_CONFIG } from '../../../types/Auth0/__tests__/TEST_CONFIG';

jest.mock('../../../auth0Wrappers');

const getAuth0TokenMock = getAuth0Token as jest.Mock;
const getResourceServerByIdMock = getResourceServerById as jest.Mock;

describe('Auth0RepoImpl', () => {
    describe('getAllPermissions', () => {
        let repo: Auth0RepoImpl;

        beforeEach(() => {
            jest.resetAllMocks();
            jest.useFakeTimers().setSystemTime(0);

            getAuth0TokenMock.mockResolvedValue('mockToken');
            getResourceServerByIdMock.mockResolvedValue({
                body: { scopes: 'abcscopes' },
            });

            repo = new Auth0RepoImpl(makeTestContext());
        });

        it('uses the context from the constructor to get the token then call the wrapper', async () => {
            await expect(repo.getAllPermissions()).resolves.toEqual(
                'abcscopes',
            );
            expect(getAuth0TokenMock).toHaveBeenCalledTimes(1);
            expect(getAuth0TokenMock).toHaveBeenCalledWith({
                config: TEST_CONFIG(),
                mgmtToken: undefined,
                logger: expect.anything(),
            });
            expect(getResourceServerByIdMock).toHaveBeenCalledWith(
                {
                    config: TEST_CONFIG(),
                    mgmtToken: 'mockToken',
                    logger: expect.anything(),
                },
                'rsid',
            );
        });

        it('rethrows error if getting auth0 token fails', async () => {
            getAuth0TokenMock.mockRejectedValueOnce(new Error('blah'));
            await expect(repo.getAllPermissions()).rejects.toThrow(
                new Error('blah'),
            );
            expect(getAuth0TokenMock).toHaveBeenCalledTimes(1);
            expect(getResourceServerByIdMock).not.toHaveBeenCalled();
        });

        it('rethrows error if getResourceServerById fails', async () => {
            getResourceServerByIdMock.mockRejectedValueOnce(new Error('blah'));
            await expect(repo.getAllPermissions()).rejects.toThrow(
                new Error('blah'),
            );
        });

        it('allows overwriting the resource server ID instead of using the one from the config', async () => {
            await repo.getAllPermissions('overwritten');
            expect(getResourceServerByIdMock).toHaveBeenCalledWith(
                {
                    config: TEST_CONFIG(),
                    mgmtToken: 'mockToken',
                    logger: expect.anything(),
                },
                'overwritten',
            );
        });

        it('waits for the specified timeout before calling second request and reuses existing token for it', async () => {
            await repo.getAllPermissions();
            expect(getResourceServerByIdMock).toHaveBeenCalledTimes(1);
            expect(getAuth0TokenMock).toHaveBeenCalledTimes(1);

            const secondPromise = repo.getAllPermissions();

            // promise should have got to the point of awaiting the timeout
            // after 200ms
            await setTimeout(100);
            expect(getResourceServerByIdMock).toHaveBeenCalledTimes(1);

            await setTimeout(100);
            await secondPromise;
            expect(getAuth0TokenMock).toHaveBeenCalledTimes(1);
            expect(getResourceServerByIdMock).toHaveBeenCalledTimes(2);
        });
    });
});
