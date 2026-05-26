export type ArrayDifferences<T> = {
    added: Array<T>;
    removed: Array<T>;
    unchanged: Array<T>;
};

/**
 * Technically it's more like a find differences between sets.
 * However, sets don't have user-definable hash function, so
 * we are using arrays. Non-unique elements of arrays will be
 * collapsed into single elements, and ordering may not be
 * preserved.
 */
export const findArrayDifferences = <T>(
    curr: Array<T>,
    next: Array<T>,
    hashFn: (val: T) => string,
): ArrayDifferences<T> => {
    const diffs: ArrayDifferences<T> = {
        added: [],
        removed: [],
        unchanged: [],
    };

    const currMap = new Map<string, T>(curr.map((val) => [hashFn(val), val]));
    const nextMap = new Map<string, T>(next.map((val) => [hashFn(val), val]));

    currMap.forEach((val, hash) => {
        if (nextMap.delete(hash)) {
            diffs.unchanged.push(val);
        } else {
            diffs.removed.push(val);
        }
    });

    // by this point we know that all values in nextMap must be newly added
    // ones because the matching ones were deleted on line 8
    diffs.added = [...nextMap.values()];

    return diffs;
};
