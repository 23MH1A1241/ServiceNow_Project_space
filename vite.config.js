/* global process */
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { Buffer } from 'node:buffer';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const getAuthHeader = () => 'Basic ' + Buffer.from(`${env.SN_USERNAME}:${env.SN_PASSWORD}`).toString('base64');

  return {
    plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api/now': {
        target: env.SN_INSTANCE_URL,
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Authorization', getAuthHeader());
            proxyReq.setHeader('Content-Type', 'application/json');
            proxyReq.setHeader('Accept', 'application/json');
          });
          proxy.on('proxyRes', (proxyRes) => {
            delete proxyRes.headers['www-authenticate'];
          });
        }
      },
      '/$sn-va-web-client-app.do': {
        target: env.SN_INSTANCE_URL,
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            delete proxyRes.headers['x-frame-options'];
            delete proxyRes.headers['content-security-policy'];
          });
        }
      },
      '/api/sn_va_web_client': {
        target: env.SN_INSTANCE_URL,
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
             // For the VA client API, we also need auth if we want it to work without the user logging into SN separately
             proxyReq.setHeader('Authorization', getAuthHeader());
          });
        }
      },
      '/styles': { target: env.SN_INSTANCE_URL, changeOrigin: true, secure: false },
      '/scripts': { target: env.SN_INSTANCE_URL, changeOrigin: true, secure: false },
      '/sys_attachment.do': { target: env.SN_INSTANCE_URL, changeOrigin: true, secure: false },
      '/amb': { target: env.SN_INSTANCE_URL, changeOrigin: true, secure: false, ws: true },
      '/xai-api': {
        target: 'https://api.x.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/xai-api/, ''),
        secure: true
      }
    }
  }
  }
})
