import { createRole, getAuth0Token, updateRole } from '../../../auth0Wrappers';
import { Auth0RepoImpl } from '../Auth0RepoImpl';
import { makeTestContext, TEST_ROLES } from './testConstants';

jest.mock('../../../auth0Wrappers');

const createRoleMock = createRole as jest.Mock;
const getAuth0TokenMock = getAuth0Token as jest.Mock;
const updateRoleMock = updateRole as jest.Mock;

describe('Auth0RepoImpl', () => {
    describe('pushRole', () => {
        let repo: Auth0RepoImpl;

        beforeEach(() => {
            jest.resetAllMocks();

            getAuth0TokenMock.mockResolvedValue('mockToken');
            repo = new Auth0RepoImpl(makeTestContext());
        });

        it('gets a token and updates a role if the role arg has an auth0Id already', async () => {
            updateRoleMock.mockResolvedValueOnce({ body: TEST_ROLES[1] });
            await expect(
                repo.pushRole({
                    auth0Id: 'rid1',
                    name: 'rname1in',
                    description: 'rdesc1in',
                }),
            ).resolves.toEqual({
                auth0Id: 'rid2',
                name: 'rname2',
                description: 'rdesc2',
            });
            expect(getAuth0TokenMock).toHaveBeenCalledTimes(1);
            expect(updateRoleMock).toHaveBeenCalledTimes(1);
        });

        it('gets a token and creates a role if the role arg has no auth0Id', async () => {
            createRoleMock.mockResolvedValueOnce({ body: TEST_ROLES[1] });
            await repo.pushRole({
                name: 'rname1in',
                description: 'rdesc1in',
            });
            expect(getAuth0TokenMock).toHaveBeenCalledTimes(1);
            expect(createRoleMock).toHaveBeenCalledTimes(1);
            expect(updateRoleMock).toHaveBeenCalledTimes(0);
        });
    });
});
