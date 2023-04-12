module.exports = {
    env: {
        browser: true,
        es2021: true
    },
    extends: 'standard',
    overrides: [],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    'space-before-function-paren': [
        'error',
        {
            anonymous: 'always',
            named: 'always',
            asyncArrow: 'always'
        }
    ],
    rules: {
        semi: ['error', 'always'],
        quotes: ['error', 'single'],
        indent: ['error', 4]
    }
};
