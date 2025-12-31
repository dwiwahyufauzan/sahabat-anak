import { dev } from '$app/environment';

const config = {
  apiUrl: dev 
    ? 'http://localhost:3000/api' 
    : (import.meta.env.VITE_API_URL || 'https://api.sahabat-anak.org/api')
};

export default config;
