/* eslint-disable no-magic-numbers */
import pino from 'pino';
import { TEST_AUTH_DECLARATION } from './TEST_AUTH_DECLARATION';
import { TEST_CONFIG } from '../../types/Auth0/__tests__/TEST_CONFIG';
import { syncAuth0 } from '../syncAuth0';
import { Role } from '../../types';

jest.mock('../../auth0Wrappers');

const MOCK_REPO = {
    getAllPermissions: jest.fn(),
    pushPermissions: jest.fn(),
    getAllRoleNames: jest.fn(),
    pushRole: jest.fn(),
    getRolePermissions: jest.fn(),
    associateRolePermissions: jest.fn(),
    removeRolePermissions: jest.fn(),
};

const TEST_CTX = (shouldRemovePermissions: boolean = false) => ({
    config: TEST_CONFIG(shouldRemovePermissions),
    mgmtToken: undefined,
    logger: pino({ level: 'silent' }),
});

const TEST_DEPS = (shouldRemovePermissions: boolean = false) => ({
    ctx: TEST_CTX(shouldRemovePermissions),
    repo: MOCK_REPO,
});

const TEST_ROLE_NAMES = (): Map<string, Role> =>
    new Map([
        [
            'rname1',
            {
                auth0Id: 'rid1',
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
    ]);

describe('syncAuth0', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        MOCK_REPO.getAllRoleNames.mockResolvedValueOnce(TEST_ROLE_NAMES());
        MOCK_REPO.pushRole.mockResolvedValue({
            auth0Id: 'rid1',
            name: 'rname1',
            description: 'rdesc1',
        });
        MOCK_REPO.getRolePermissions.mockResolvedValue([]);
        MOCK_REPO.removeRolePermissions.mockResolvedValue(undefined);
    });

    it('calls the expected functions', async () => {
        await syncAuth0(TEST_AUTH_DECLARATION, TEST_DEPS());
        expect(MOCK_REPO.pushPermissions).toHaveBeenCalledWith(
            TEST_AUTH_DECLARATION.permissions,
        );
        expect(MOCK_REPO.getAllRoleNames).toHaveBeenCalledTimes(1);
        expect(MOCK_REPO.getRolePermissions).toHaveBeenCalledTimes(3);
        expect(MOCK_REPO.removeRolePermissions).toHaveBeenCalledTimes(0);
        expect(MOCK_REPO.associateRolePermissions).toHaveBeenCalledTimes(3);
    });

    it('doesnt call associate role permissions if role permissions are same', async () => {
        await syncAuth0(
            {
                ...TEST_AUTH_DECLARATION,
                rolePermissions: {
                    rname1: {
                        description: 'rdesc1',
                        permissions: [],
                    },
                    rname2: {
                        description: 'rdesc2',
                        permissions: [],
                    },
                },
            },
            TEST_DEPS(),
        );
        expect(MOCK_REPO.removeRolePermissions).toHaveBeenCalledTimes(0);
        expect(MOCK_REPO.associateRolePermissions).toHaveBeenCalledTimes(0);
    });

    it('calls to remove role permissions if role permissions were removed', async () => {
        MOCK_REPO.getRolePermissions.mockReset();
        MOCK_REPO.getRolePermissions.mockResolvedValue([
            {
                value: 'removed',
                description: 'permission that will be removed',
            },
        ]);
        await syncAuth0(
            {
                ...TEST_AUTH_DECLARATION,
                rolePermissions: {
                    rname1: {
                        description: 'rdesc1',
                        permissions: [],
                    },
                    rname2: {
                        description: 'rdesc2',
                        permissions: [],
                    },
                },
            },
            TEST_DEPS(),
        );
        expect(MOCK_REPO.removeRolePermissions).toHaveBeenCalledTimes(2);
        expect(MOCK_REPO.associateRolePermissions).toHaveBeenCalledTimes(0);
    });
});
