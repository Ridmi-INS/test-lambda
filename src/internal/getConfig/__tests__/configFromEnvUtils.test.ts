/* eslint-disable no-magic-numbers */
/* Magic numbers make sense as test data */
import {
    getBooleanConf,
    getFloatConf,
    getIntegerConf,
    getStringConf,
} from '../configFromEnvUtils';

describe('configFromEnvUtils', () => {
    const OLD_ENV = process.env;

    beforeAll(() => {
        jest.resetModules(); // clear the cache
        process.env = {
            ...OLD_ENV,
            exampleStringEnvVar: 'abc',
            exampleIntegerEnvVar: '4',
            exampleFloatEnvVar: '3.1',
            exampleBooleanEnvVar: 'true',
        }; // Make a copy
    });

    afterAll(() => {
        process.env = OLD_ENV; // Restore old environment
    });

    describe('getStringConf', () => {
        it('gets the variable from the env', () =>
            expect(getStringConf('exampleStringEnvVar', 'e')).toEqual('abc'));
        it('defaults to the default when variable not present in the env', () =>
            expect(getStringConf('nonexistantStringVar', 'e')).toEqual('e'));
    });

    describe('getIntegerConf', () => {
        it('gets the variable from the env', () =>
            expect(getIntegerConf('exampleIntegerEnvVar', 9)).toEqual(4));
        it('defaults when name not present in the env', () =>
            expect(getIntegerConf('nonexistantIntegerVar', 9)).toEqual(9));
        it("defaults when env variable doesn't contain int", () =>
            expect(getIntegerConf('exampleStringEnvVar', 8)).toEqual(8));
        it('rounds down when env variable contains float', () =>
            expect(getIntegerConf('exampleFloatEnvVar', 7)).toEqual(3));
    });

    describe('getFloatConf', () => {
        it('gets the variable from the env', () =>
            expect(getFloatConf('exampleFloatEnvVar', 9)).toEqual(3.1));
        it('defaults when name not present in the env', () =>
            expect(getFloatConf('nonexistantFloatVar', 9.3)).toEqual(9.3));
        it("defaults when env variable doesn't contain int", () =>
            expect(getFloatConf('exampleStringEnvVar', 8.1)).toEqual(8.1));
        it('gets the env var when its an int', () =>
            expect(getFloatConf('exampleIntegerEnvVar', 7)).toEqual(4));
    });

    describe('getBooleanConf', () => {
        it('gets the variable from the env', () =>
            expect(getBooleanConf('exampleBooleanEnvVar', false)).toEqual(
                true,
            ));
        it('defaults when name not present in the env', () =>
            expect(getBooleanConf('nonexistantBooleanVar', true)).toEqual(
                true,
            ));
        it('when variable is present but not equal to true, results in false', () =>
            expect(getBooleanConf('exampleStringEnvVar', true)).toEqual(false));
    });
});
