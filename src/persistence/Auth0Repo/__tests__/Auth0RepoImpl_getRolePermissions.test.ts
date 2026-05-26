import { getAuth0Token, getRolePermissions } from '../../../auth0Wrappers';
import { TEST_CONFIG } from '../../../types/Auth0/__tests__/TEST_CONFIG';
import { Auth0RepoImpl } from '../Auth0RepoImpl';
import {
    makeTestContext,
    TEST_GET_PERMISSIONS,
    TEST_PERMISSIONS_CONVERTED,
} from './testConstants';

jest.mock('../../../auth0Wrappers');

const getAuth0TokenMock = getAuth0Token as jest.Mock;
const getRolePermissionsMock = getRolePermissions as jest.Mock;

describe('Auth0RepoImpl', () => {
    describe('getRolePermissions', () => {
        let repo: Auth0RepoImpl;

        beforeEach(() => {
            jest.resetAllMocks();

            getAuth0TokenMock.mockResolvedValue('mockToken');
            repo = new Auth0RepoImpl(makeTestContext());
        });

        it('gets a token and gets the permissions for a role', async () => {
            getRolePermissionsMock.mockResolvedValueOnce(TEST_GET_PERMISSIONS);
            await expect(repo.getRolePermissions('raid')).resolves.toEqual(
                TEST_PERMISSIONS_CONVERTED,
            );
            expect(getAuth0TokenMock).toHaveBeenCalledTimes(1);
            expect(getRolePermissionsMock).toHaveBeenCalledTimes(1);
            expect(getRolePermissionsMock).toHaveBeenCalledWith(
                {
                    config: TEST_CONFIG(),
                    mgmtToken: 'mockToken',
                    logger: expect.anything(),
                },
                'raid',
            );
        });
    });
});
