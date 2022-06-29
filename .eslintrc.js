module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ['airbnb-base'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint'],
    rules: {
        'import/extensions': 'off',
        'import/prefer-default-export': 'off',
        'comma-dangle': 'off',
        'operator-linebreak': 'off',
        'no-console': 'off',
        'no-param-reassign': 'off',
        semi: 'off',
        'prefer-template': 'off',
        indent: ['error', 4],
    },
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
    },
}