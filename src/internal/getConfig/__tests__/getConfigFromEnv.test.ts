import {
    getBooleanConf,
    getFloatConf,
    getIntegerConf,
    getStringConf,
} from '../configFromEnvUtils';
import { getConfigFromEnv } from '../getConfigFromEnv';

jest.mock('../configFromEnvUtils');

const mockGetBooleanConf = getBooleanConf as jest.Mock;
const mockGetIntegerConf = getIntegerConf as jest.Mock;
const mockGetStringConf = getStringConf as jest.Mock;
const mockGetFloatConf = getFloatConf as jest.Mock;
const configFromEnvMocks = [
    mockGetBooleanConf,
    mockGetIntegerConf,
    mockGetStringConf,
    mockGetFloatConf,
];

describe('getConfigFromEnv', () => {
    it('calls exactly one of the configFromEnvUtils functions for each key', () => {
        const result = getConfigFromEnv();

        const totalCallCount = configFromEnvMocks
            .map((mock) => mock.mock.calls.length)
            .reduce((prev: number, curr: number) => curr + prev);
        expect(totalCallCount).toEqual(Object.keys(result).length);
    });
});
