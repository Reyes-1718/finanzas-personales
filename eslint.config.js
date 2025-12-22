import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";

export default [
  // 1. Archivos a ignorar
  {
    ignores: ["dist/**/*", "node_modules/**/*", "test-results/**/*"],
  },

  // 2. Configuración base
  js.configs.recommended,

  // 3. Configuración para archivos de Node (Configuraciones y Tests)
  {
    files: ["*.config.js", "*.config.cjs", "playwright.config.js"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // 4. Configuración para archivos de Test (Playwright/Vitest)
  {
    files: ["tests/**/*.{js,jsx}", "**/*.spec.{js,jsx}"],
    languageOptions: {
      globals: {
        ...globals.node,
        // Globals de Playwright
        test: "readonly",
        expect: "readonly",
        page: "readonly",
        browser: "readonly",
        context: "readonly",
        // Globals de Vitest (si lo usas)
        describe: "readonly",
        it: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        vi: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "warn",
    },
  },

  // 5. Configuración principal de React y Frontend
  {
    files: ["src/**/*.{js,jsx}", "**/*.{js,mjs,cjs,jsx}"],
    plugins: {
      react: pluginReact,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node, // Permite 'process' también en archivos de desarrollo
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",       // <--- ESTO ELIMINA EL 90% DE TUS ERRORES
      "no-unused-vars": "warn",        // Cambia el error a advertencia para que te deje trabajar
      "no-empty": "warn",              // Bloques vacíos como advertencia
    },
  },
];