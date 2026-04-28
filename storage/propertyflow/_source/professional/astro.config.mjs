import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://your-domain.example",
  output: "static",
  build: { format: "directory" }
});
