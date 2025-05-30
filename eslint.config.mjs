// import globals from 'globals';
// import eslintJs from '@eslint/js';
// import eslintTs from 'typescript-eslint';
// import reactPlugin from 'eslint-plugin-react';
// import importPlugin from 'eslint-plugin-import';
// import reactHooksPlugin from 'eslint-plugin-react-hooks';
// import perfectionistPlugin from 'eslint-plugin-perfectionist';
// import unusedImportsPlugin from 'eslint-plugin-unused-imports';

// // ----------------------------------------------------------------------

// /**
//  * @rules common
//  * from 'react', 'eslint-plugin-react-hooks'...
//  */
// const commonRules = () => ({
//   ...reactHooksPlugin.configs.recommended.rules,
//   'func-names': 1,
//   'no-bitwise': 2,
//   'no-unused-vars': 0,
//   'object-shorthand': 1,
//   'no-useless-rename': 1,
//   'default-case-last': 2,
//   'consistent-return': 2,
//   'no-constant-condition': 1,
//   'default-case': [2, { commentPattern: '^no default$' }],
//   'lines-around-directive': [2, { before: 'always', after: 'always' }],
//   'arrow-body-style': [2, 'as-needed', { requireReturnForObjectLiteral: false }],
//   // react
//   'react/jsx-key': 0,
//   'react/prop-types': 0,
//   'react/display-name': 0,
//   'react/no-children-prop': 0,
//   'react/jsx-boolean-value': 2,
//   'react/self-closing-comp': 2,
//   'react/react-in-jsx-scope': 0,
//   'react/jsx-no-useless-fragment': [1, { allowExpressions: true }],
//   'react/jsx-curly-brace-presence': [2, { props: 'never', children: 'never' }],
//   // typescript
//   '@typescript-eslint/no-shadow': 2,
//   '@typescript-eslint/no-explicit-any': 0,
//   '@typescript-eslint/no-empty-object-type': 0,
//   '@typescript-eslint/consistent-type-imports': 1,
//   '@typescript-eslint/no-unused-vars': [1, { args: 'none' }],
// });

// /**
//  * @rules import
//  * from 'eslint-plugin-import'.
//  */
// const importRules = () => ({
//   ...importPlugin.configs.recommended.rules,
//   'import/named': 0,
//   'import/export': 0,
//   'import/default': 0,
//   'import/namespace': 0,
//   'import/no-named-as-default': 0,
//   'import/newline-after-import': 2,
//   'import/no-named-as-default-member': 0,
//   'import/no-cycle': [
//     0, // disabled if slow
//     { maxDepth: '∞', ignoreExternal: false, allowUnsafeDynamicCyclicDependency: false },
//   ],
// });

// /**
//  * @rules unused imports
//  * from 'eslint-plugin-unused-imports'.
//  */
// const unusedImportsRules = () => ({
//   'unused-imports/no-unused-imports': 1,
//   'unused-imports/no-unused-vars': [
//     0,
//     { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
//   ],
// });

// /**
//  * @rules sort or imports/exports
//  * from 'eslint-plugin-perfectionist'.
//  */
// const sortImportsRules = () => {
//   const customGroups = {
//     mui: ['custom-mui'],
//     auth: ['custom-auth'],
//     hooks: ['custom-hooks'],
//     utils: ['custom-utils'],
//     types: ['custom-types'],
//     routes: ['custom-routes'],
//     sections: ['custom-sections'],
//     components: ['custom-components'],
//   };

//   return {
//     'perfectionist/sort-named-imports': [1, { type: 'line-length', order: 'asc' }],
//     'perfectionist/sort-named-exports': [1, { type: 'line-length', order: 'asc' }],
//     'perfectionist/sort-exports': [
//       1,
//       {
//         order: 'asc',
//         type: 'line-length',
//         groupKind: 'values-first',
//       },
//     ],
//     'perfectionist/sort-imports': [
//       2,
//       {
//         order: 'asc',
//         ignoreCase: true,
//         type: 'line-length',
//         environment: 'node',
//         maxLineLength: undefined,
//         newlinesBetween: 'always',
//         internalPattern: ['^src/.+'],
//         groups: [
//           'style',
//           'side-effect',
//           'type',
//           ['builtin', 'external'],
//           customGroups.mui,
//           customGroups.routes,
//           customGroups.hooks,
//           customGroups.utils,
//           'internal',
//           customGroups.components,
//           customGroups.sections,
//           customGroups.auth,
//           customGroups.types,
//           ['parent', 'sibling', 'index'],
//           ['parent-type', 'sibling-type', 'index-type'],
//           'object',
//           'unknown',
//         ],
//         customGroups: {
//           value: {
//             [customGroups.mui]: ['^@mui/.+'],
//             [customGroups.auth]: ['^src/auth/.+'],
//             [customGroups.hooks]: ['^src/hooks/.+'],
//             [customGroups.utils]: ['^src/utils/.+'],
//             [customGroups.types]: ['^src/types/.+'],
//             [customGroups.routes]: ['^src/routes/.+'],
//             [customGroups.sections]: ['^src/sections/.+'],
//             [customGroups.components]: ['^src/components/.+'],
//           },
//         },
//       },
//     ],
//   };
// };

// /**
//  * Custom ESLint configuration.
//  */
// export const customConfig = {
//   plugins: {
//     'react-hooks': reactHooksPlugin,
//     'unused-imports': unusedImportsPlugin,
//     perfectionist: perfectionistPlugin,
//     import: importPlugin,
//   },
//   settings: {
//     // https://www.npmjs.com/package/eslint-import-resolver-typescript
//     ...importPlugin.configs.typescript.settings,
//     'import/resolver': {
//       ...importPlugin.configs.typescript.settings['import/resolver'],
//       typescript: {
//         project: './tsconfig.json',
//       },
//     },
//   },
//   rules: {
//     ...commonRules(),
//     ...importRules(),
//     ...unusedImportsRules(),
//     ...sortImportsRules(),
//   },
// };

// // ----------------------------------------------------------------------

// export default [
//   { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
//   { ignores: ['*', '!src/', '!eslint.config.*'] },
//   {
//     languageOptions: {
//       globals: { ...globals.browser, ...globals.node },
//     },
//     settings: { react: { version: 'detect' } },
//   },
//   eslintJs.configs.recommended,
//   ...eslintTs.configs.recommended,
//   reactPlugin.configs.flat.recommended,
//   customConfig,
// ];





import globals from 'globals';
import eslintJs from '@eslint/js';
import eslintTs from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import importPlugin from 'eslint-plugin-import';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import perfectionistPlugin from 'eslint-plugin-perfectionist';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';

// ----------------------------------------------------------------------

const commonRules = () => ({
  ...reactHooksPlugin.configs.recommended.rules,
  'func-names': 'warn',
  'no-bitwise': 'warn',
  'no-unused-vars': 'off',
  'object-shorthand': 'warn',
  'no-useless-rename': 'warn',
  'default-case-last': 'warn',
  'consistent-return': 'warn',
  'no-constant-condition': 'warn',
  'default-case': ['warn', { commentPattern: '^no default$' }],
  'lines-around-directive': ['warn', { before: 'always', after: 'always' }],
  'arrow-body-style': ['warn', 'as-needed', { requireReturnForObjectLiteral: false }],
  'react/jsx-key': 'off',
  'react/prop-types': 'off',
  'react/display-name': 'off',
  'react/no-children-prop': 'off',
  'react/jsx-boolean-value': 'warn',
  'react/self-closing-comp': 'warn',
  'react/react-in-jsx-scope': 'off',
  'react/jsx-no-useless-fragment': ['warn', { allowExpressions: true }],
  'react/jsx-curly-brace-presence': ['warn', { props: 'never', children: 'never' }],
  '@typescript-eslint/no-shadow': 'warn',
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-empty-object-type': 'off',
  '@typescript-eslint/consistent-type-imports': 'warn',
  '@typescript-eslint/no-unused-vars': ['warn', { args: 'none' }],
});

const importRules = () => ({
  ...importPlugin.configs.recommended.rules,
  'import/named': 'off',
  'import/export': 'off',
  'import/default': 'off',
  'import/namespace': 'off',
  'import/no-named-as-default': 'off',
  'import/newline-after-import': 'warn',
  'import/no-named-as-default-member': 'off',
  'import/no-cycle': 'off',
});

const unusedImportsRules = () => ({
  'unused-imports/no-unused-imports': 'warn',
  'unused-imports/no-unused-vars': 'off',
});

const sortImportsRules = () => ({
  'perfectionist/sort-named-imports': 'off',
  'perfectionist/sort-named-exports': 'off',
  'perfectionist/sort-exports': 'off',
  'perfectionist/sort-imports': 'off',
});

// ----------------------------------------------------------------------

export const customConfig = {
  plugins: {
    'react-hooks': reactHooksPlugin,
    'unused-imports': unusedImportsPlugin,
    perfectionist: perfectionistPlugin,
    import: importPlugin,
  },
  settings: {
    ...importPlugin.configs.typescript.settings,
    'import/resolver': {
      ...importPlugin.configs.typescript.settings['import/resolver'],
      typescript: {
        project: './tsconfig.json',
      },
    },
  },
  rules: {
    ...commonRules(),
    ...importRules(),
    ...unusedImportsRules(),
    ...sortImportsRules(),
  },
};

export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { ignores: ['*', '!src/', '!eslint.config.*'] },
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    settings: { react: { version: 'detect' } },
  },
  eslintJs.configs.recommended,
  ...eslintTs.configs.recommended,
  reactPlugin.configs.flat.recommended,
  customConfig,
];
