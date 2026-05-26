export const getStringConf = (name: string, defaultValue: string): string =>
    process.env[name] ?? defaultValue;

export const getIntegerConf = (name: string, defaultValue: number): number => {
    const val = process.env[name];
    if (!val) {
        return defaultValue;
    }

    const valNumber = parseInt(val);
    if (Number.isNaN(valNumber)) {
        return defaultValue;
    }

    return valNumber;
};

export const getFloatConf = (name: string, defaultValue: number): number => {
    const val = process.env[name];
    if (!val) {
        return defaultValue;
    }

    const valNumber = parseFloat(val);
    if (Number.isNaN(valNumber)) {
        return defaultValue;
    }

    return valNumber;
};

export const getBooleanConf = (name: string, defaultValue: boolean): boolean =>
    process.env[name] ? process.env[name] === 'true' : defaultValue;
