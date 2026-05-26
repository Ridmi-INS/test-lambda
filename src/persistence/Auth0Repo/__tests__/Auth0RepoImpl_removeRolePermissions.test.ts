import { getAuth0Token, removeRolePermissions } from '../../../auth0Wrappers';
import { TEST_CONFIG } from '../../../types/Auth0/__tests__/TEST_CONFIG';
import { Auth0RepoImpl } from '../Auth0RepoImpl';
import { makeTestContext, TEST_GET_PERMISSIONS } from './testConstants';

jest.mock('../../../auth0Wrappers');

const getAuth0TokenMock = getAuth0Token as jest.Mock;
const removeRolePermissionsMock = removeRolePermissions as jest.Mock;

describe('Auth0RepoImpl', () => {
    describe('removeRolePermissions', () => {
        let repo: Auth0RepoImpl;

        beforeEach(() => {
            jest.resetAllMocks();

            getAuth0TokenMock.mockResolvedValue('mockToken');
            removeRolePermissionsMock.mockResolvedValueOnce(
                TEST_GET_PERMISSIONS,
            );

            repo = new Auth0RepoImpl(makeTestContext(undefined, true));
        });

        it('throws an error if we are not configured to remove permissions', async () => {
            const noRemoveRepo = new Auth0RepoImpl(makeTestContext());
            await expect(
                noRemoveRepo.removeRolePermissions('raid', ['abc']),
            ).rejects.toThrow();
            expect(getAuth0TokenMock).not.toHaveBeenCalled();
        });

        it('throws an error if we are configured to remove permissions, \
		   but no permission names are provided', async () => {
            await expect(
                repo.removeRolePermissions('raid', []),
            ).rejects.toThrow();
            expect(getAuth0TokenMock).not.toHaveBeenCalled();
        });

        it('gets a token and removes role permissions', async () => {
            await expect(
                repo.removeRolePermissions('raid', ['perm1']),
            ).resolves.toEqual(undefined);
            expect(getAuth0TokenMock).toHaveBeenCalledTimes(1);
            expect(removeRolePermissionsMock).toHaveBeenCalledTimes(1);
            expect(removeRolePermissionsMock).toHaveBeenCalledWith(
                {
                    config: TEST_CONFIG(true),
                    mgmtToken: 'mockToken',
                    logger: expect.anything(),
                },
                'raid',
                {
                    permissions: [
                        {
                            permission_name: 'perm1',
                            resource_server_identifier: 'rsid',
                        },
                    ],
                },
            );
        });

        it('overwrites resource_server_identifier with value from arguments', async () => {
            await repo.removeRolePermissions('raid', ['perm1'], 'overwritten');
            expect(removeRolePermissionsMock).toHaveBeenCalledTimes(1);
            expect(removeRolePermissionsMock).toHaveBeenCalledWith(
                {
                    config: TEST_CONFIG(true),
                    mgmtToken: 'mockToken',
                    logger: expect.anything(),
                },
                'raid',
                {
                    permissions: [
                        {
                            permission_name: 'perm1',
                            resource_server_identifier: 'overwritten',
                        },
                    ],
                },
            );
        });
    });
});
