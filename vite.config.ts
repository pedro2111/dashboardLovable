import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from 'fs';

// Função para ler a URL da API do config.js
function getApiUrl() {
  console.log('peguei a url de proxy');
  return 'http://sigpf-servicos-des.apps.nprd.caixa/backend';
}

export default defineConfig(({ mode, command }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: command === 'build' ? getApiUrl() : 'http://localhost:3001/backend/',//http://sigpf-servicos-des.apps.nprd.caixa/backend
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log(`[PROXY REQUEST] ${req.method} ${req.url} -> ${proxyReq.getHeader('host')}${proxyReq.path}`);
          });

          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log(`[PROXY RESPONSE] ${req.method} ${req.url} -> ${proxyRes.statusCode}`);
          });

          proxy.on('error', (err, req, res) => {
            console.error(`[PROXY ERROR] ${req.method} ${req.url} ->`, err.message);
          });
        }
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
