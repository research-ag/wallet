/* eslint-disable no-undef */
module.exports = {
  env: {
    node: true,
    commonjs: true,
    browser: true,
    es6: true,
  },
  extends: [
    // By extending from a plugin config, we can get recommended rules without having to add them manually.
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:import/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:@typescript-eslint/recommended",
    // This disables the formatting rules in ESLint that Prettier is going to be responsible for handling.
    // Make sure it's always the last config, so it gets the chance to override other configs.
    "eslint-config-prettier",
  ],
  settings: {
    react: {
      // Tells eslint-plugin-react to automatically detect the version of React to use.
      version: "detect",
    }, // Tells eslint how to resolve imports
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
        // use <root>/path/to/folder/tsconfig.json
        project: "./tsconfig.json",
      },
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint", "react-hooks", "prettier", "jsx-a11y", "import"],
  rules: {
    "no-empty-pattern": "warn",
    "no-console": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "import/no-named-as-default-member": "warn",
    "import/no-named-as-default": "warn",
    "jsx-a11y/anchor-is-valid": "warn",
    "import/no-unresolved": "error",
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/no-noninteractive-element-interactions": "warn",
    "jsx-a11y/no-static-element-interactions": "off",
    "import/named": "warn",
    "react/prop-types": "warn",
    "click-events-have-key-events": "off",
    "no-unused-vars": ["warn", { vars: "all", args: "after-used", ignoreRestSiblings: false }],
    "prefer-const": "warn",
    "@typescript-eslint/no-empty-function": "warn",
    "no-empty": "warn",
    "no-case-declarations": "warn",
    "no-useless-escape": "warn",
    "react/react-in-jsx-scope": "off",
    camelcase: "off",
    "spaced-comment": "warn",
    quotes: ["warn", "double"],
    "no-duplicate-imports": "error",
    "react/jsx-key": "warn",
    "jsx-a11y/no-autofocus": "off",
    "@typescript-eslint/no-empty-interface": "warn",
    "no-self-assign": "warn",
    "no-var": "warn",
    "react/no-unescaped-entities": "warn",
    "jsx-a11y/alt-text": "warn",
    "jsx-a11y/aria-role": "warn",
    // Add your own rules here to override ones from the extended configs.
  },
};
