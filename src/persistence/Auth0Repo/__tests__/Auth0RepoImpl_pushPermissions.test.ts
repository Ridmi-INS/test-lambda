import { getAuth0Token, updateResourceServer } from '../../../auth0Wrappers';
import { TEST_CONFIG } from '../../../types/Auth0/__tests__/TEST_CONFIG';
import { Auth0RepoImpl } from '../Auth0RepoImpl';
import { makeTestContext } from './testConstants';

jest.mock('../../../auth0Wrappers');

const getAuth0TokenMock = getAuth0Token as jest.Mock;
const updateResourceServerMock = updateResourceServer as jest.Mock;

describe('Auth0RepoImpl', () => {
    describe('pushPermissions', () => {
        let repo: Auth0RepoImpl;

        beforeEach(() => {
            jest.resetAllMocks();

            getAuth0TokenMock.mockResolvedValue('mockToken');
            updateResourceServerMock.mockResolvedValueOnce({
                body: { scopes: ['abc'] },
            });
            repo = new Auth0RepoImpl(makeTestContext());
        });

        it('throws error if permissions array to push is empty', async () => {
            await expect(repo.pushPermissions([])).rejects.toThrow();
            expect(getAuth0TokenMock).not.toHaveBeenCalled();
            expect(updateResourceServerMock).not.toHaveBeenCalled();
        });

        it('gets a token and updates the resource server', async () => {
            await expect(
                repo.pushPermissions([
                    { value: 'abc', description: 'abcdesc' },
                ]),
            ).resolves.toEqual(['abc']);

            expect(getAuth0TokenMock).toHaveBeenCalledTimes(1);
            expect(updateResourceServerMock).toHaveBeenCalledTimes(1);
            expect(updateResourceServerMock).toHaveBeenCalledWith(
                {
                    config: TEST_CONFIG(),
                    mgmtToken: 'mockToken',
                    logger: expect.anything(),
                },
                'rsid',
                { scopes: [{ value: 'abc', description: 'abcdesc' }] },
            );
        });

        it('rethrows error if updateResourceServerMock fails', async () => {
            updateResourceServerMock.mockReset();
            updateResourceServerMock.mockRejectedValueOnce(new Error('blah'));
            await expect(
                repo.pushPermissions([
                    { value: 'abc', description: 'abcdesc' },
                ]),
            ).rejects.toThrow(new Error('blah'));

            expect(getAuth0TokenMock).toHaveBeenCalledTimes(1);
            expect(updateResourceServerMock).toHaveBeenCalledTimes(1);
        });

        it('overwrites the config resource server with the argument', async () => {
            await repo.pushPermissions(
                [{ value: 'abc', description: 'abcdesc' }],
                'overwritten',
            );
            expect(updateResourceServerMock).toHaveBeenCalledWith(
                {
                    config: TEST_CONFIG(),
                    mgmtToken: 'mockToken',
                    logger: expect.anything(),
                },
                'overwritten',
                { scopes: [{ value: 'abc', description: 'abcdesc' }] },
            );
        });
    });
});
