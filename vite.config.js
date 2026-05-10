import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use the admin credentials to securely proxy all API requests to ServiceNow
// This completely hides the admin credentials from the frontend browser
const authHeader = 'Basic ' + Buffer.from('admin:CC3aYtxK$2l*').toString('base64');

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/now': {
        target: 'https://dev296999.service-now.com',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Inject ServiceNow credentials on the server side
            proxyReq.setHeader('Authorization', authHeader);
            proxyReq.setHeader('Content-Type', 'application/json');
            proxyReq.setHeader('Accept', 'application/json');
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            // Prevent native browser authentication popups
            delete proxyRes.headers['www-authenticate'];
          });
        }
      }
    }
  }
})
