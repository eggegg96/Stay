import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@layouts": path.resolve(__dirname, "./src/layouts"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@common": path.resolve(__dirname, "./src/components/common"),
      "@search": path.resolve(__dirname, "./src/components/search"),
      "@accommodation": path.resolve(
        __dirname,
        "./src/components/accommodation"
      ),
      "@filters": path.resolve(__dirname, "./src/components/filters"),
      "@ui": path.resolve(__dirname, "./src/ui"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@constants": path.resolve(__dirname, "./src/constants"),
      "@data": path.resolve(__dirname, "./src/data"),
      "@contexts": path.resolve(__dirname, "./src/contexts"),
      "@styles": path.resolve(__dirname, "./src/styles"),
    },
  },
});
