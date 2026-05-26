import * as yup from 'yup';

export const DEFAULT_STRING_MAX_LENGTH = 4095;

export const DEFAULT_ARRAY_MAX_LENGTH = 4095;

export const MAX_ROLES = 255;

export const defaultStringValidator = yup
    .string()
    .max(DEFAULT_STRING_MAX_LENGTH)
    .defined();
