import { defineConfig } from "vite";

// Served from the custom domain root (https://alexbrenes.com/ and
// https://www.alexbrenes.com/), so assets live at "/", not a repo subpath.
export default defineConfig({
  base: "/",
  publicDir: "static",
});
