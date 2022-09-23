module.exports = {
  parser: "babel-eslint",
  env: {
    es6: true,
    node: true,
    browser: true,
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["react"],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
  ],
  rules: {
    "prettier/prettier": "warn",
    "no-unused-vars": "warn",
    "no-extra-boolean-cast": 0,
    "react/prop-types": 0,
    // "linebreak-style": ["error", "unix"],
    "linebreak-style": ["error", "windows"],
    "arrow-body-style": "off",
    "prefer-arrow-callback": "off",
    "react/display-name": "off",
  },
};
