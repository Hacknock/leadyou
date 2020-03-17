module.exports = {
    'env': {
        'browser': true,
        'commonjs': true,
        'es6': true,
        'node': true
    },
    'extends': 'eslint:recommended',
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly'
    },
    'parserOptions': {
        'ecmaVersion': 2018
    },
    'rules': {
        'indent': ['error', 4],
        'linebreak-style': ['error', 'unix'],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        'semi-spacing': ['error', {'before': false, 'after': true}],
        'array-bracket-spacing': ['error', 'never'],
        'block-spacing': 'error',
        'brace-style': 'error',
        'comma-spacing': ['error', {'before': false, 'after': true}],
        'key-spacing': ['error', {'beforeColon': false, 'afterColon': true}],
        'no-spaced-func': 'error',
        'no-trailing-spaces': ['error', {'skipBlankLines': true}],
        'object-curly-spacing': ['error', 'never'],
        'keyword-spacing': ['error', {'before': true, 'after': true}],
        'space-before-blocks': 'error',
        'space-in-parens': ['error', 'never'],
        'arrow-spacing': ['error', {'before': true, 'after': true}],
        'space-infix-ops': 'error'
    }
};
