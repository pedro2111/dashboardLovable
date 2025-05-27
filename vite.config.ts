import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
//target: 'http://sigpf-servicos-des.apps.nprd.caixa/backend',
import fs from 'fs';

// Função para ler a URL da API do config.js
function getApiUrl() {
  console.log('peguei a url de proxy')
  return 'http://sigpf-servicos-des.apps.nprd.caixa/backend';
 /* try {
    const configContent = fs.readFileSync('./public/config.js', 'utf-8');
    const configMatch = configContent.match(/API_URL: '([^']+)'/);
    return configMatch ? configMatch[1] : 'http://sigpf-servicos-des.apps.nprd.caixa/backend';
  } catch (error) {
    console.error('Erro ao ler config.js:', error);
    return 'http://sigpf-servicos-des.apps.nprd.caixa/backend';
  }
  */
}

export default defineConfig(({ mode, command }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: command === 'build' ? getApiUrl() : 'http://sigpf-servicos-des.apps.nprd.caixa/backend',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
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
