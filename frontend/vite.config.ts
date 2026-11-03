import react from "@vitejs/plugin-react"
import { fileURLToPath } from "url"
import { defineConfig } from "vitest/config"

export default defineConfig({
  base: "/",
  plugins: [react()],
  build: {
    sourcemap: true,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "vendor-react",
              test: /node_modules\/(react|react-dom|react-router|scheduler)(\/|-)/,
            },
            { name: "vendor-icons", test: /node_modules\/@fortawesome\// },
            { name: "vendor-validation", test: /node_modules\/zod\// },
          ],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./setupTests.ts"],
    maxWorkers: 2,
    coverage: { provider: "v8", include: ["src/**/*.{ts,tsx}"] },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: {
    modules: {
      generateScopedName: "[name]__[local]__[hash:base64:5]",
    },
  },
})
