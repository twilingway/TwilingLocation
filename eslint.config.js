import { defineConfig } from "eslint/config";
import react from "eslint-plugin-react";
import reactNative from "eslint-plugin-react-native";
import eslint from "@eslint/js";
import tsEslintPlugin from "@typescript-eslint/eslint-plugin";
import tsEslintParser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";
import globals from "globals";

const GLOBALS_BROWSER_FIX = Object.assign({}, globals.browser, {
  AudioWorkletGlobalScope: globals.browser["AudioWorkletGlobalScope "],
});

delete GLOBALS_BROWSER_FIX["AudioWorkletGlobalScope "];

export default defineConfig([
  eslint.configs.recommended,
  {
    ignores: ["metro.config.cjs"], // Исключаем файл из проверки
  },
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parser: tsEslintParser,
      globals: {
        ...GLOBALS_BROWSER_FIX,
        ...globals.node,
        setTimeout: "readonly",
        setInterval: "readonly",
        clearTimeout: "readonly",
        clearInterval: "readonly",
      },
    },
    plugins: {
      prettier: prettier,
      react: react,
      "react-native": reactNative,
      "@typescript-eslint": tsEslintPlugin,
    },

    rules: {
      ...tsEslintPlugin.configs.recommended.rules,
      "react-native/no-unused-styles": 2,
      "react-native/split-platform-components": 2,
      "react-native/no-inline-styles": 2,
      "react-native/no-color-literals": "warn",
      "react-native/no-raw-text": 2,
      "react-native/no-single-element-style-arrays": 2,
      "react-hooks/exhaustive-deps": "off",
      "no-undef": "warn",
      "prettier/prettier": [
        "error",
        {
          singleQuote: false,
          semi: true,
          objectWrap: "preserve",
          trailingComma: "es5",
          bracketSpacing: true,
          printWidth: 80,
          endOfLine: "auto",
        },
      ],
      "@typescript-eslint/no-empty-function": ["off"],
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-require-imports": "warn",
    },
  },
]);
