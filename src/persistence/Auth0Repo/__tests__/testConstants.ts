import {
    Auth0Context,
    Auth0GetPermissions,
    Auth0Role,
    Permission,
} from '../../../types';
import { TEST_CONFIG } from '../../../types/Auth0/__tests__/TEST_CONFIG';
import { mockLogger } from '../../../internal/__tests__/mockLogger';

export const makeTestContext = (
    mgmtToken?: string,
    shouldRemovePermissions: boolean = false,
): Auth0Context => ({
    config: TEST_CONFIG(shouldRemovePermissions),
    mgmtToken,
    logger: mockLogger(),
});

export const TEST_ROLES: Array<Auth0Role> = [
    {
        id: 'rid1',
        name: 'rname1',
        description: 'rdesc1',
    },
    {
        id: 'rid2',
        name: 'rname2',
        description: 'rdesc2',
    },
    // duplicated role names should only appear once
    // in the output, no need to throw an error as
    // it should be impossible to duplicate role names
    // in Auth0 anyway.
    {
        id: 'duplicatedrid',
        name: 'rname1',
        description: 'rdesc1',
    },
];

export const TEST_GET_PERMISSIONS: { body: Auth0GetPermissions } = {
    body: {
        start: 0,
        limit: 1,
        total: 1,
        permissions: [
            {
                resource_server_identifier: 'rsi',
                resource_server_name: 'rsn',
                permission_name: 'permname',
                description: 'desc',
            },
        ],
    },
};

export const TEST_PERMISSIONS_CONVERTED: Array<Permission> = [
    {
        value: 'permname',
        description: 'desc',
    },
];
