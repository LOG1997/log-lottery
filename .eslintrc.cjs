module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-essential",
    "plugin:@typescript-eslint/recommended",
  ],
  overrides: [],
  parser: "vue-eslint-parser",
  parserOptions: {
    ecmaVersion: "latest",
    parser: "@typescript-eslint/parser",
    sourceType: "module",
  },
  plugins: ["vue", "@typescript-eslint"],
  rules: {
    "@typescript-eslint/ban-types": [
      "error",
      {
        extendDefaults: true,
        types: {
          "{}": false,
        },
      },
    ],
    // 关闭typescript类型为any的警告
    "@typescript-eslint/no-explicit-any": ["off"],
    // 驼峰命名，但忽略index
    "vue/multi-word-component-names": [
      "error",
      {
        ignores: ["index"], //需要忽略的组件名
      },
    ],
    "no-console": "warn",
    "no-debugger": "warn",
    complexity: ["warn", { max: 5 }],
    // 禁止使用多个空格
    "no-multi-spaces": "error",
    // 最大连续空行数
    "no-multiple-empty-lines": ["error", { max: 2, maxEOF: 1, maxBOF: 0 }],
    // 代码块中去除前后空行
    "padded-blocks": ["error", "never"],
    // 使用单引号，字符串中包含了一个其它引号 允许"a string containing 'single' quotes"
    quotes: ["error", "single", { avoidEscape: true }],
    // return之前必须空行
    "newline-before-return": "error",
    //文件末尾强制换行
    "eol-last": ["error", "always"],
    //禁止空格和 tab 的混合缩进
    "no-mixed-spaces-and-tabs": ["error", "smart-tabs"],
  },
};
