import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "theme/**",
    "playwright-report/**",
    "test-results/**",
    "coverage/**",
    "jest.config.js",
    "jest.setup.ts",
    "playwright.config.ts",
  ]),
]);

export default eslintConfig;
