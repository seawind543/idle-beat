module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  root: true,
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts'],
      },
    },
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 12,
    babelOptions: {
      configFile: './babel.config.js',
    },
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  plugins: ['@babel', 'prettier'],
  rules: {
    'no-shadow': 0,
    // Turn off, since we are not write react here
    'react/jsx-filename-extension': 0,
    'import/extensions': 'off',
  },
  // https://eslint.org/docs/user-guide/configuring/configuration-files#configuration-based-on-glob-patterns
  overrides: [
    /**
     * use separate parsers for .js and .ts
     * Following for typescript .ts only
     */
    {
      files: ['{src,examples}/**/*.ts'],
      extends: [
        'airbnb-typescript/base',
        'plugin:prettier/recommended',
        'plugin:@typescript-eslint/recommended',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 12,
        babelOptions: {
          configFile: './babel.config.js',
        },
        project: './tsconfig.json', // take the root tsconfig.json
      },
      plugins: ['@babel', 'prettier', '@typescript-eslint'],
    },
  ],
};
