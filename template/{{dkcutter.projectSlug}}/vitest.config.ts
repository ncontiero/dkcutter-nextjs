import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [react()],
  test: {
    environment: "jsdom",
{%- if dkcutter.usePlaywright %}
    exclude: ["**/node_modules/**", "**/.git/**", "**/*.e2e.spec.ts"],
{%- endif %}
    setupFiles: ["./vitest.setup.ts"],
  },
});
