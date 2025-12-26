// vite.config.ts
import { defineConfig } from "file:///C:/Users/rafae/Desktop/dev/grimorium/node_modules/.pnpm/vite@5.4.20_@types+node@22.18.8/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/rafae/Desktop/dev/grimorium/node_modules/.pnpm/@vitejs+plugin-react-swc@3._54bfa8641304735635ff69382fd5d60e/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { TanStackRouterVite } from "file:///C:/Users/rafae/Desktop/dev/grimorium/node_modules/.pnpm/@tanstack+router-plugin@1.1_2b6f86e7d9706feaec144cc022c4462e/node_modules/@tanstack/router-plugin/dist/esm/vite.js";
var __vite_injected_original_dirname = "C:\\Users\\rafae\\Desktop\\dev\\grimorium";
var host = process.env.TAURI_DEV_HOST;
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: host || "localhost",
    port: 8080,
    strictPort: true,
    hmr: host ? { host } : void 0,
    watch: {
      // Reduce file watching overhead
      ignored: ["**/node_modules/**", "**/dist/**", "**/src-tauri/**"]
    }
  },
  envPrefix: ["VITE_", "TAURI_ENV_*"],
  build: {
    target: process.env.TAURI_ENV_PLATFORM == "windows" ? "chrome105" : "safari13",
    minify: !process.env.TAURI_ENV_DEBUG ? "esbuild" : false,
    sourcemap: !!process.env.TAURI_ENV_DEBUG,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["@tanstack/react-router"],
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"]
        }
      }
    }
  },
  optimizeDeps: {
    include: ["react", "react-dom", "@tanstack/react-router"],
    exclude: ["@tauri-apps/api"]
  },
  plugins: [
    TanStackRouterVite(),
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxyYWZhZVxcXFxEZXNrdG9wXFxcXGRldlxcXFxncmltb3JpdW1cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXHJhZmFlXFxcXERlc2t0b3BcXFxcZGV2XFxcXGdyaW1vcml1bVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvcmFmYWUvRGVza3RvcC9kZXYvZ3JpbW9yaXVtL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgVGFuU3RhY2tSb3V0ZXJWaXRlIH0gZnJvbSBcIkB0YW5zdGFjay9yb3V0ZXItcGx1Z2luL3ZpdGVcIjtcblxuY29uc3QgaG9zdCA9IHByb2Nlc3MuZW52LlRBVVJJX0RFVl9IT1NUO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4gKHtcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogaG9zdCB8fCBcImxvY2FsaG9zdFwiLFxuICAgIHBvcnQ6IDgwODAsXG4gICAgc3RyaWN0UG9ydDogdHJ1ZSxcbiAgICBobXI6IGhvc3QgPyB7IGhvc3QgfSA6IHVuZGVmaW5lZCxcbiAgICB3YXRjaDoge1xuICAgICAgLy8gUmVkdWNlIGZpbGUgd2F0Y2hpbmcgb3ZlcmhlYWRcbiAgICAgIGlnbm9yZWQ6IFsnKiovbm9kZV9tb2R1bGVzLyoqJywgJyoqL2Rpc3QvKionLCAnKiovc3JjLXRhdXJpLyoqJ11cbiAgICB9XG4gIH0sXG4gIGVudlByZWZpeDogWydWSVRFXycsICdUQVVSSV9FTlZfKiddLFxuICBidWlsZDoge1xuICAgIHRhcmdldDogcHJvY2Vzcy5lbnYuVEFVUklfRU5WX1BMQVRGT1JNID09ICd3aW5kb3dzJyA/ICdjaHJvbWUxMDUnIDogJ3NhZmFyaTEzJyxcbiAgICBtaW5pZnk6ICFwcm9jZXNzLmVudi5UQVVSSV9FTlZfREVCVUcgPyAnZXNidWlsZCcgOiBmYWxzZSxcbiAgICBzb3VyY2VtYXA6ICEhcHJvY2Vzcy5lbnYuVEFVUklfRU5WX0RFQlVHLFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICB2ZW5kb3I6IFsncmVhY3QnLCAncmVhY3QtZG9tJ10sXG4gICAgICAgICAgcm91dGVyOiBbJ0B0YW5zdGFjay9yZWFjdC1yb3V0ZXInXSxcbiAgICAgICAgICB1aTogWydAcmFkaXgtdWkvcmVhY3QtZGlhbG9nJywgJ0ByYWRpeC11aS9yZWFjdC1kcm9wZG93bi1tZW51J10sXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGluY2x1ZGU6IFsncmVhY3QnLCAncmVhY3QtZG9tJywgJ0B0YW5zdGFjay9yZWFjdC1yb3V0ZXInXSxcbiAgICBleGNsdWRlOiBbJ0B0YXVyaS1hcHBzL2FwaSddXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICBUYW5TdGFja1JvdXRlclZpdGUoKSxcbiAgICByZWFjdCgpLFxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxuICAgIH0sXG4gIH0sXG59KSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTBTLFNBQVMsb0JBQW9CO0FBQ3ZVLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsU0FBUywwQkFBMEI7QUFIbkMsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTSxPQUFPLFFBQVEsSUFBSTtBQUd6QixJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssT0FBTztBQUFBLEVBQ3pDLFFBQVE7QUFBQSxJQUNOLE1BQU0sUUFBUTtBQUFBLElBQ2QsTUFBTTtBQUFBLElBQ04sWUFBWTtBQUFBLElBQ1osS0FBSyxPQUFPLEVBQUUsS0FBSyxJQUFJO0FBQUEsSUFDdkIsT0FBTztBQUFBO0FBQUEsTUFFTCxTQUFTLENBQUMsc0JBQXNCLGNBQWMsaUJBQWlCO0FBQUEsSUFDakU7QUFBQSxFQUNGO0FBQUEsRUFDQSxXQUFXLENBQUMsU0FBUyxhQUFhO0FBQUEsRUFDbEMsT0FBTztBQUFBLElBQ0wsUUFBUSxRQUFRLElBQUksc0JBQXNCLFlBQVksY0FBYztBQUFBLElBQ3BFLFFBQVEsQ0FBQyxRQUFRLElBQUksa0JBQWtCLFlBQVk7QUFBQSxJQUNuRCxXQUFXLENBQUMsQ0FBQyxRQUFRLElBQUk7QUFBQSxJQUN6QixlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixjQUFjO0FBQUEsVUFDWixRQUFRLENBQUMsU0FBUyxXQUFXO0FBQUEsVUFDN0IsUUFBUSxDQUFDLHdCQUF3QjtBQUFBLFVBQ2pDLElBQUksQ0FBQywwQkFBMEIsK0JBQStCO0FBQUEsUUFDaEU7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLFNBQVMsQ0FBQyxTQUFTLGFBQWEsd0JBQXdCO0FBQUEsSUFDeEQsU0FBUyxDQUFDLGlCQUFpQjtBQUFBLEVBQzdCO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxtQkFBbUI7QUFBQSxJQUNuQixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUNGLEVBQUU7IiwKICAibmFtZXMiOiBbXQp9Cg==
