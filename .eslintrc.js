module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
  },
  extends: ["@nuxtjs/eslint-config-typescript", "plugin:prettier/recommended"],
  plugins: [],
  rules: {
    "vue/multi-word-component-names": 0,
    "vue/require-default-prop": 0,
    "vue/no-mutating-props": 0,
    "no-console": [
      "error",
      {
        allow: ["warn", "error", "info"],
      },
    ],
  },
};
