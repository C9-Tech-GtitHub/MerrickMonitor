import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  define: {
    // Ensure VITE_GOOGLE_CLIENT_ID is available in production
    "import.meta.env.VITE_GOOGLE_CLIENT_ID": JSON.stringify(
      process.env.VITE_GOOGLE_CLIENT_ID,
    ),
  },
});
