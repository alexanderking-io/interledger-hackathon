import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import vike from "vike/plugin";

export default defineConfig({
  plugins: [vike({}), react({})],
  define: {
    "process.env.NEXTAUTH_URL": JSON.stringify(process.env.NEXTAUTH_URL),
  },
  resolve: {
    alias: {
      "@": new URL("./", import.meta.url).pathname,
    },
  },
});
