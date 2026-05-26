import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
    globalIgnores([
        '**/node_modules',
        '**/public',
        '**/build',
        '**/coverage',
        '**/jest.config.ts',
    ]),
    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
        plugins: { js },
        extends: ['js/recommended'],
        languageOptions: { globals: globals.node },
    },
    tseslint.configs.recommended,
    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
        rules: {
            'no-restricted-syntax': [
                'error',
                {
                    message:
                        'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
                    selector: 'ForInStatement',
                },
                {
                    message:
                        "Javascript/Typescript Dates are not clear. Please use Js-Joda's date types instead",
                    selector: 'NewExpression[callee.name=Date]',
                },
            ],

            'no-unreachable': 'error',

            'no-restricted-imports': [
                'error',
                {
                    name: 'moment',
                    message: "Please use Js-Joda's date types instead",
                },
            ],

            '@typescript-eslint/no-explicit-any': 'error',

            'no-magic-numbers': [
                'error',
                {
                    ignore: [0, 1],
                    ignoreArrayIndexes: false,
                    enforceConst: true,
                },
            ],

            'max-lines-per-function': [
                'error',
                {
                    max: 100,
                    skipBlankLines: true,
                    skipComments: true,
                },
            ],

            'max-depth': 'error',

            'max-lines': 'error',
        },
    },
]);
