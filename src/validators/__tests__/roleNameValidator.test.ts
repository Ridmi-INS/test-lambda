import { roleNameValidator } from '../roleNameValidator';

const validCases: Array<string> = ['USERS', 'READ_ONLY_ADMIN'];

const invalidCases: Array<string> = [
    'lowercase',
    'camelCase',
    'dashes-in-name',
    'numerical123',
    'symbol$',
];

describe('roleNameValidator', () => {
    it.each(validCases)('should validate %s', (input) => {
        expect(roleNameValidator.isValidSync(input)).toBeTruthy();
    });

    it.each(invalidCases)('should not validate %s', (input) => {
        expect(roleNameValidator.isValidSync(input)).toBeFalsy();
    });
});
