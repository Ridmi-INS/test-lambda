import { getAuth0Token, getRoles } from '../../../auth0Wrappers';
import { TEST_CONFIG } from '../../../types/Auth0/__tests__/TEST_CONFIG';
import { Auth0RepoImpl } from '../Auth0RepoImpl';
import { makeTestContext, TEST_ROLES } from './testConstants';

jest.mock('../../../auth0Wrappers');

const getAuth0TokenMock = getAuth0Token as jest.Mock;
const getRolesMock = getRoles as jest.Mock;

describe('Auth0RepoImpl', () => {
    describe('getAllRoleNames', () => {
        let repo: Auth0RepoImpl;

        beforeEach(() => {
            jest.resetAllMocks();

            getAuth0TokenMock.mockResolvedValue('mockToken');
            repo = new Auth0RepoImpl(makeTestContext());
        });

        it('gets a token and gets roles', async () => {
            getRolesMock.mockResolvedValue({
                body: {
                    roles: TEST_ROLES,
                },
            });

            await expect(repo.getAllRoleNames()).resolves.toEqual(
                new Map([
                    [
                        'rname1',
                        {
                            auth0Id: 'duplicatedrid',
                            name: 'rname1',
                            description: 'rdesc1',
                        },
                    ],
                    [
                        'rname2',
                        {
                            auth0Id: 'rid2',
                            name: 'rname2',
                            description: 'rdesc2',
                        },
                    ],
                ]),
            );
            expect(getAuth0TokenMock).toHaveBeenCalledTimes(1);
            expect(getRolesMock).toHaveBeenCalledTimes(1);
            expect(getRolesMock).toHaveBeenCalledWith({
                config: TEST_CONFIG(),
                mgmtToken: 'mockToken',
                logger: expect.anything(),
            });
        });
    });
});
