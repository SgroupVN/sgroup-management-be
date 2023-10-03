module.exports = {
    settings: {
        'import/resolver': {
            typescript: {},
        },
    },
    parser: '@typescript-eslint/parser',
    env: {
        jest: true,
        es6: true,
        node: true,
    },
    ignorePatterns: ['.eslintrc.js', 'src/database/migrations/*.ts'],
    parserOptions: {
        ecmaVersion: 2020,
        project: './tsconfig.eslint.json',
        sourceType: 'module',
    },
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
    ],
    plugins: [
        '@typescript-eslint',
        'prettier',
    ],
    rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
    },
};
