import { dev } from '$app/environment';

// Environment configuration
const config = {
  // API URL - will be replaced at build time
  apiUrl: dev 
    ? 'http://localhost:3000/api' 
    : import.meta.env.VITE_API_URL || 'https://api.sahabat-anak.org/api',
  
  // App name
  appName: 'Sahabat Anak Indonesia',
  
  // Version
  version: '1.0.0',
};

// Validate required config in production
if (!dev && !import.meta.env.VITE_API_URL) {
  console.warn('⚠️ WARNING: VITE_API_URL is not set. Using default API URL.');
}

export default config;
