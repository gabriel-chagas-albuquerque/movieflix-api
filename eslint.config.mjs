import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
  },
  tseslint.configs.recommended,

  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    rules: {
      // Forçar aspas duplas
      quotes: ["error", "double"],

      // Forçar ponto e vírgula
      semi: ["error", "always"],

      // Outras regras de estilo úteis
      indent: ["error", 2],
      "comma-dangle": ["error", "always-multiline"],
      "object-curly-spacing": ["error", "always"],
      "array-bracket-spacing": ["error", "never"],
      "space-before-blocks": "error",
      "keyword-spacing": "error",

      // Para TypeScript, desabilitar a regra JS e usar a do TS
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
    },
  },

  // Ignorar arquivos específicos
  {
    ignores: ["dist/**", "build/**", "node_modules/**"],
  },
  
]);
