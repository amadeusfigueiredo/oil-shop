import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"
import react from "eslint-plugin-react-x"
import hooks from "eslint-plugin-react-hooks"
import prettier from "eslint-config-prettier"

export default tseslint.config(
  { ignores: ["dist/**", "coverage/**", "node_modules/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    plugins: { "react-x": react, "react-hooks": hooks },
    rules: {
      ...react.configs["recommended-typescript"].rules,
      ...hooks.configs.recommended.rules,
    },
  },
  {
    files: ["**/*.test.{ts,tsx}", "setupTests.ts"],
    languageOptions: { globals: globals.vitest },
  },
  { files: ["*.js", "*.ts"], languageOptions: { globals: globals.node } },
  prettier,
)
