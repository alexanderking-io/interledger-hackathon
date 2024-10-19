import vike from "vike/plugin";
import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";

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
