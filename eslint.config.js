import js from "@eslint/js";
import globals from "globals";

// Các luật bên dưới ánh xạ trực tiếp từ coding standard (số mục ghi trong ngoặc).
// Định dạng (khoảng trắng, nháy kép, dấu chấm phẩy, dấu phẩy cuối...) do Prettier đảm nhiệm.
export default [
  { ignores: ["node_modules/"] },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node,
    },
    rules: {
      // 2. References
      "no-var": "error",
      "prefer-const": "error",
      "no-const-assign": "error",
      // 3. Objects
      "no-object-constructor": "error",
      "object-shorthand": ["error", "always"],
      "no-prototype-builtins": "error",
      "prefer-object-spread": "error",
      // 4. Arrays
      "no-array-constructor": "error",
      "array-callback-return": "error",
      // 5. Destructuring
      "prefer-destructuring": ["error", { object: true, array: false }],
      // 6. Strings
      quotes: ["error", "double", { avoidEscape: true, allowTemplateLiterals: true }],
      "prefer-template": "error",
      "no-eval": "error",
      "no-useless-escape": "error",
      // 7. Functions
      "no-loop-func": "error",
      "no-inner-declarations": "error",
      "prefer-rest-params": "error",
      "default-param-last": "error",
      "no-new-func": "error",
      "no-param-reassign": ["error", { props: true }],
      "prefer-spread": "error",
      // 8. Arrow functions
      "prefer-arrow-callback": "error",
      "arrow-body-style": ["error", "as-needed"],
      "no-confusing-arrow": "error",
      // 9. Classes
      "no-useless-constructor": "error",
      "no-dupe-class-members": "error",
      "class-methods-use-this": "error",
      // 10. Modules
      "no-duplicate-imports": "error",
      // 11. Iterators
      "no-restricted-syntax": [
        "error",
        {
          selector: "ForInStatement",
          message: "Dùng Object.keys/values/entries + forEach/map thay cho for..in (mục 11.1).",
        },
        {
          selector: "ForOfStatement",
          message: "Dùng map/filter/forEach/every/some thay cho for..of (mục 11.1).",
        },
      ],
      // 12-13. Properties, Variables
      "dot-notation": "error",
      "prefer-exponentiation-operator": "error",
      "one-var": ["error", "never"],
      "no-multi-assign": "error",
      "no-plusplus": "error",
      "no-unused-vars": ["error", { args: "after-used" }],
      // 15-16. Comparison, Blocks
      eqeqeq: ["error", "always"],
      "no-case-declarations": "error",
      "no-nested-ternary": "error",
      "no-unneeded-ternary": "error",
      "no-mixed-operators": "error",
      curly: ["error", "multi-line"],
      "no-else-return": "error",
      // 22. Coercion
      radix: "error",
      "no-new-wrappers": "error",
      // 23. Naming
      "id-length": ["error", { min: 2 }],
      camelcase: ["error", { properties: "never" }],
      "new-cap": "error",
      "no-underscore-dangle": ["error", { allowFunctionParams: false }],
    },
  },
];
