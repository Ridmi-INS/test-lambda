import { RolePermissions } from '../../types';
import { rolePermissionsValidator } from '../rolePermissionsValidator';

const validRolePermissions: Array<{
    input: RolePermissions;
    testName: string;
}> = [
    {
        input: {},
        testName: 'empty',
    },
    {
        input: {
            USERS: {
                description: 'Basic user role',
                permissions: [
                    'matters:view',
                    'matters:create',
                    'example:breakingStyle:butStillValid',
                ],
            },
            READ_ONLY_ADMIN: {
                description: 'read only admin role',
                permissions: ['rtc-admin:org:view'],
            },
        },
        testName: 'happy path',
    },
    {
        input: {
            USERS: {
                description: 'Basic user role',
                permissions: ['matters:view', 'matters:create'],
            },
        },
        testName: 'happy path (smaller object)',
    },
];

// one of the rare cases where the type is genuinely 'any'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const invalidRolePermissions: Array<{ input: any; testName: string }> = [
    {
        input: null,
        testName: 'null input',
    },
    {
        input: 123,
        testName: 'number input',
    },
    {
        input: 'string',
        testName: 'string input',
    },
    {
        input: {
            invalidKeyFormat: {
                description:
                    'should not validate because role names should be uppercase',
                permissions: [],
            },
        },
        testName: 'invalid role name format (using lowercase)',
    },
    {
        input: {
            '2': {
                description:
                    'should not validate because role names should be uppercase',
                permissions: [],
            },
        },
        testName: 'invalid role name format (numerical)',
    },
    {
        input: {
            'abc%': {
                description:
                    'should not validate because role names should be uppercase',
                permissions: [],
            },
        },
        testName: 'invalid role name format (symbol)',
    },
    {
        input: {
            '': {
                description:
                    'should not validate because role names should be uppercase',
                permissions: [],
            },
        },
        testName: 'invalid role name format (empty string)',
    },
    {
        input: {
            USERS: {
                description: 'Basic user role',
                permissions: ['matters:12387view', 'matters:create'],
            },
        },
        testName: 'invalid permission name format (contains numbers)',
    },
    {
        input: {
            USERS: {
                description: 'Basic user role',
                permissions: ['bingo', 'matters:create'],
            },
        },
        testName: 'invalid permission name format (no colon)',
    },
    {
        input: {
            USERS: {
                description: 'Basic user role',
                permissions: [':bingo', 'matters:create'],
            },
        },
        testName: 'invalid permission name format (colon at beginning)',
    },
    {
        input: {
            USERS: {
                description: 'Basic user role',
                permissions: ['%matters:view%', 'matters:create'],
            },
        },
        testName:
            'valid permission name format encapsulated by invalid characters',
    },
    {
        input: {
            USERS: {
                permissions: ['matters:view', 'matters:create'],
            },
        },
        testName: 'no description for role',
    },
    {
        input: {
            USERS: {
                description: 'Basic user role',
            },
        },
        testName: 'no permissions array',
    },
    {
        input: {
            USERS: {
                description: 'Basic user role',
                permissions: ['matters:view', 'matters:create'],
                extraField: 'invalid',
            },
        },
        testName: 'extra unknown field in role',
    },
    {
        input: {
            ...validRolePermissions[1].input,
            NOpermissionS: {
                description: 'unlikely to do this, but should be valid',
                permissions: [],
            },
        },
        testName: 'role with lowercase in name',
    },
];

describe('rolePermissionsValidator', () => {
    it.each(validRolePermissions)(
        `validates $testName successfully`,
        ({ input }) => {
            expect(() =>
                rolePermissionsValidator.validateSync(input),
            ).not.toThrow();
        },
    );

    it.each(invalidRolePermissions)(
        'doesnt validate $testName',
        ({ input }) => {
            expect(() =>
                rolePermissionsValidator.validateSync(input),
            ).toThrow();
        },
    );
});
