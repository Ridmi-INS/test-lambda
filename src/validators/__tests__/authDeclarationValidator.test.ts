import { AuthDeclaration, RolePermissions } from '../../types';
import { authDeclarationValidator } from '../authDeclarationValidator';
import { MAX_ROLES } from '../constants';

const validAuthDeclaration: Array<{
    input: AuthDeclaration;
    testName: string;
}> = [
    {
        input: {
            rolePermissions: {},
            permissions: [],
        },
        testName: 'empty',
    },
    {
        input: {
            rolePermissions: {
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
            // note that there is no validation here that the permissions array contains all the
            // mentioned roles in the rolePermissions object
            permissions: [
                {
                    value: 'matters:view',
                    description: 'View matters',
                },
                {
                    value: 'matters:create',
                    description: 'Create matters',
                },
            ],
        },
        testName: 'happy path',
    },
    {
        input: {
            rolePermissions: {
                USERS: {
                    description: 'Basic user role',
                    permissions: ['matters:view'],
                },
            },
            permissions: [
                {
                    value: 'matters:view',
                    description: 'View matters',
                },
            ],
        },
        testName: 'happy path (smaller object)',
    },
];

// one of the rare cases where the type is genuinely 'any'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const invalidAuthDeclaration: Array<{ input: any; testName: string }> = [
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
        input: {},
        testName: 'empty object input',
    },
    {
        input: {
            rolePermissions: null,
            permissions: null,
        },
        testName: 'correct object keys with null values',
    },
    {
        input: {
            rolePermissions: null,
            permissions: [],
        },
        testName: 'valid permissions but null rolePermissions',
    },
    {
        input: {
            ...validAuthDeclaration[1].input,
            permissions: null,
        },
        testName: 'valid rolePermissions but null permissions',
    },
    {
        input: {
            ...validAuthDeclaration[1].input,
            permissions: [1, 1, 1],
        },
        testName:
            'valid rolePermissions but permissions array of number not string',
    },
    {
        input: {
            ...validAuthDeclaration[1].input,
            rolePermissions: {
                ...validAuthDeclaration[1].input.rolePermissions,
                NOpermissionS: {
                    description: 'unlikely to do this, but should be valid',
                    permissions: [],
                },
            },
        },
        testName: 'role name with lowercase',
    },
];

describe('authDeclarationValidator', () => {
    it.each(validAuthDeclaration)(
        `validates $testName successfully`,
        ({ input }) => {
            expect(() =>
                authDeclarationValidator.validateSync(input),
            ).not.toThrow();
        },
    );

    it.each(invalidAuthDeclaration)(
        'doesnt validate $testName',
        ({ input }) => {
            expect(() =>
                authDeclarationValidator.validateSync(input),
            ).toThrow();
        },
    );

    it('doesnt validate object exceeding the max number of roles', () => {
        const testObject: RolePermissions = {};
        for (let i = 0; i < MAX_ROLES + 1; ++i) {
            testObject[`key${i}`] = {
                description: `role${i}`,
                permissions: [],
            };
        }

        expect(authDeclarationValidator.isValidSync(testObject)).toBeFalsy();
    });
});
