import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	base: "/PaintingApp/",
  server: {
    port: 8080,
    open: true,
  },
});
