import { AuthDeclaration } from '../../types';

export const TEST_AUTH_DECLARATION: AuthDeclaration = {
    permissions: [
        {
            value: 'matters:read',
            description: 'read matters',
        },
        {
            value: 'matters:create',
            description: 'create matters',
        },
        {
            value: 'matters:update',
            description: 'update matters',
        },
        {
            value: 'organisations:create',
            description: 'create new organisations',
        },
    ],
    rolePermissions: {
        USERS: {
            description: 'Regular users in an organisation',
            permissions: ['matters:read', 'matters:create', 'matters:update'],
        },
        RTCADMIN: {
            description: 'Realtime admin of entire system',
            permissions: [
                'matters:read',
                'matters:create',
                'matters:update',
                'organisations:create',
            ],
        },
        rname1: {
            description:
                'This role will already exist in auth0, so we should update it',
            permissions: ['matters:read'],
        },
    },
};
