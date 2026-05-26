/* eslint-disable no-magic-numbers */
/* Using magic numbers in the tests */
import {
    ArrayDifferences,
    findArrayDifferences,
} from '../findArrayDifferences';

type TestData<T> = {
    curr: Array<T>;
    next: Array<T>;
    hashFn: (val: T) => string;
    expectedOutput: ArrayDifferences<T>;
    testName: string;
};

// Explicit any makes sense as we are testing a generic
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TEST_INPUTS: Array<TestData<any>> = [
    {
        testName: 'empty curr and next',
        curr: [],
        next: [],
        hashFn: () => '',
        expectedOutput: {
            added: [],
            removed: [],
            unchanged: [],
        },
    },
    {
        testName: 'no change',
        curr: ['a', 'b', 'c'],
        next: ['a', 'b', 'c'],
        hashFn: (val: string) => val,
        expectedOutput: {
            added: [],
            removed: [],
            unchanged: ['a', 'b', 'c'],
        },
    },
    {
        testName: 'all removed',
        curr: ['a', 'b', 'c'],
        next: [],
        hashFn: (val: string) => val,
        expectedOutput: {
            added: [],
            removed: ['a', 'b', 'c'],
            unchanged: [],
        },
    },
    {
        testName: 'all added',
        curr: [],
        next: ['a', 'b', 'c'],
        hashFn: (val: string) => val,
        expectedOutput: {
            added: ['a', 'b', 'c'],
            removed: [],
            unchanged: [],
        },
    },
    {
        testName: 'mixed added and removed',
        curr: ['a', 'b'],
        next: ['a', 'c'],
        hashFn: (val: string) => val,
        expectedOutput: {
            added: ['c'],
            removed: ['b'],
            unchanged: ['a'],
        },
    },
    {
        testName: 'completely diff array',
        curr: ['d', 'e', 'f'],
        next: ['a', 'b', 'c'],
        hashFn: (val: string) => val,
        expectedOutput: {
            added: ['a', 'b', 'c'],
            removed: ['d', 'e', 'f'],
            unchanged: [],
        },
    },
    {
        testName: 'repeated elements become unique - removal',
        curr: ['a', 'a', 'a'],
        next: [],
        hashFn: (val: string) => val,
        expectedOutput: {
            added: [],
            removed: ['a'],
            unchanged: [],
        },
    },
    {
        testName: 'repeated elements become unique - addition',
        curr: [],
        next: ['a', 'a', 'a'],
        hashFn: (val: string) => val,
        expectedOutput: {
            added: ['a'],
            removed: [],
            unchanged: [],
        },
    },
    {
        testName: 'repeated elements become unique - unchanged',
        curr: ['a', 'a', 'a'],
        next: ['a', 'a', 'a'],
        hashFn: (val: string) => val,
        expectedOutput: {
            added: [],
            removed: [],
            unchanged: ['a', 'a', 'a'],
        },
    },
    {
        testName:
            'repeated elements become unique - unchanged, with duplicates in "next"',
        curr: ['a'],
        next: ['a', 'a', 'a'],
        hashFn: (val: string) => val,
        expectedOutput: {
            added: [],
            removed: [],
            unchanged: ['a'],
        },
    },
    {
        testName:
            'repeated elements become unique - unchanged, with duplicates in "curr"',
        curr: ['a', 'a', 'a'],
        next: ['a'],
        hashFn: (val: string) => val,
        expectedOutput: {
            added: [],
            removed: [],
            unchanged: ['a'],
        },
    },
    {
        testName: 'numbers',
        curr: [1, 2, 3, 4],
        next: [5, 4, 3],
        hashFn: (val: number) => `${val}`,
        expectedOutput: {
            added: [5],
            removed: [1, 2],
            unchanged: [4, 3],
        },
    },
    {
        testName: 'objects',
        curr: [
            { a: 'a', b: 'b' },
            { a: 'c', b: 'd' },
            { a: 'e', b: 'f' },
        ],
        next: [
            { a: 'c', b: 4 },
            { a: 'e', b: 'f' },
        ],
        hashFn: (val: { a: string | number; b: string | number }) =>
            JSON.stringify(val),
        expectedOutput: {
            added: [{ a: 'c', b: 4 }],
            removed: [
                { a: 'a', b: 'b' },
                { a: 'c', b: 'd' },
            ],
            unchanged: [{ a: 'e', b: 'f' }],
        },
    },
];

describe('findArrayDifferences', () => {
    it.each(TEST_INPUTS)(
        `works as expected - $testName`,
        ({ curr, next, hashFn, expectedOutput }) => {
            const { added, removed, unchanged } = findArrayDifferences(
                curr,
                next,
                hashFn,
            );
            expect(new Set(added)).toEqual(new Set(expectedOutput.added));
            expect(new Set(removed)).toEqual(new Set(expectedOutput.removed));
            expect(new Set(unchanged)).toEqual(
                new Set(expectedOutput.unchanged),
            );
        },
    );
});
