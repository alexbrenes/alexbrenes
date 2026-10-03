import { defineConfig } from "vite";

// Project site served from https://alexbrenes.github.io/alexbrenes/, so built
// asset URLs must be prefixed with the repo name. Dev stays at root ("/").
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/alexbrenes/" : "/",
  publicDir: "static",
}));
