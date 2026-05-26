import {
    associateRolePermissions,
    getAuth0Token,
} from '../../../auth0Wrappers';
import { TEST_CONFIG } from '../../../types/Auth0/__tests__/TEST_CONFIG';
import { Auth0RepoImpl } from '../Auth0RepoImpl';
import { makeTestContext, TEST_GET_PERMISSIONS } from './testConstants';

jest.mock('../../../auth0Wrappers');

const associateRolePermissionsMock = associateRolePermissions as jest.Mock;
const getAuth0TokenMock = getAuth0Token as jest.Mock;

describe('Auth0RepoImpl', () => {
    describe('associateRolePermissions', () => {
        let repo: Auth0RepoImpl;

        beforeEach(() => {
            jest.resetAllMocks();

            getAuth0TokenMock.mockResolvedValue('mockToken');
            repo = new Auth0RepoImpl(makeTestContext());
        });

        it('throws an error if the permission names arg is empty', async () => {
            await expect(
                repo.associateRolePermissions('a', []),
            ).rejects.toThrow();
            expect(getAuth0TokenMock).not.toHaveBeenCalled();
        });

        it('gets a token and associates the role permissions', async () => {
            associateRolePermissionsMock.mockResolvedValueOnce(
                TEST_GET_PERMISSIONS,
            );
            await expect(
                repo.associateRolePermissions('raid', ['perm1']),
            ).resolves.toEqual(undefined);
            expect(getAuth0TokenMock).toHaveBeenCalledTimes(1);
            expect(associateRolePermissionsMock).toHaveBeenCalledTimes(1);
            expect(associateRolePermissionsMock).toHaveBeenCalledWith(
                {
                    config: TEST_CONFIG(),
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

        it('overwrites resource server id from config if provided in arguments', async () => {
            associateRolePermissionsMock.mockResolvedValueOnce(
                TEST_GET_PERMISSIONS,
            );
            await repo.associateRolePermissions(
                'raid',
                ['perm1'],
                'overwritten',
            );
            expect(getAuth0TokenMock).toHaveBeenCalledTimes(1);
            expect(associateRolePermissionsMock).toHaveBeenCalledTimes(1);
            expect(associateRolePermissionsMock).toHaveBeenCalledWith(
                {
                    config: TEST_CONFIG(),
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
