import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const repoBase = process.env.REPO_BASE || "/";
export default defineConfig({
  base: repoBase,
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
});
