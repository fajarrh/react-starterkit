import { defineConfig, loadEnv, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    server: {
      port: +env.VITE_PORT,
    },
    plugins: [react(), visualizer({ open: true }) as PluginOption],
    define: {
      "process.env": import.meta,
    },
    resolve: {
      alias: {
        "@components": path.resolve(__dirname, "./src/components"),
        "@contexts": path.resolve(__dirname, "./src/contexts"),
        "@hooks": path.resolve(__dirname, "./src/hooks"),
        "@services": path.resolve(__dirname, "./src/services"),
        "@pages": path.resolve(__dirname, "./src/pages"),
        "@assets": path.resolve(__dirname, "./src/assets"),
        "@themes": path.resolve(__dirname, "./src/components/themes"),
        "@utils": path.resolve(__dirname, "./src/utils"),
        "@commons": path.resolve(__dirname, "./src/commons"),
        "@schemas": path.resolve(__dirname, "./src/schemas"),
        "@typings": path.resolve(__dirname, "./src/typings"),
        "@reducers": path.resolve(__dirname, "./src/reducers"),
      },
    },
    optimizeDeps: {
      include: ["@mui/material", "@mui/icons-material"],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes("node_modules")) {
              return id
                .toString()
                .split("node_modules/")[1]
                .split("/")[0]
                .toString();
            }
          },
        },
      },
    },
  };
});
