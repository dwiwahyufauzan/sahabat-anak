import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import config from '$lib/config';

interface Admin {
  id: number;
  username: string;
  email: string;
  fullName: string;
}

interface AdminState {
  isAuthenticated: any;
  admin: Admin | null;
  token: string | null;
  loading: boolean;
}

const initialState: AdminState = {
  admin: null,
  token: browser ? localStorage.getItem('admin_token') : null,
  loading: false,
  isAuthenticated: false // Always start as false, will be set by checkAuth
};

function createAdminStore() {
  const { subscribe, set, update } = writable<AdminState>(initialState);

  return {
    subscribe,
    login: async (username: string, password: string) => {
      update(state => ({ ...state, loading: true }));
      
      try {
        const response = await fetch(`${config.apiUrl}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
          throw new Error('Login failed');
        }

        const data = await response.json();
        
        if (browser) {
          localStorage.setItem('admin_token', data.token);
        }

        update(state => ({
          ...state,
          admin: data.admin,
          token: data.token,
          loading: false,
          isAuthenticated: true
        }));

        return { success: true };
      } catch (error) {
        update(state => ({ ...state, loading: false }));
        return { success: false, error: 'Username atau password salah' };
      }
    },
    
    logout: () => {
      if (browser) {
        localStorage.removeItem('admin_token');
      }
      set({ admin: null, token: null, loading: false, isAuthenticated: false });
      // Redirect to welcome page
      if (browser) {
        window.location.href = '/admin/welcome';
      }
    },
    
    checkAuth: async () => {
      const token = browser ? localStorage.getItem('admin_token') : null;
      
      if (!token) {
        return false;
      }

      try {
        const response = await fetch(`${config.apiUrl}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Invalid token');
        }

        const admin = await response.json();
        
        update(state => ({
          ...state,
          admin,
          token,
          isAuthenticated: true
        }));

        return true;
      } catch (error) {
        if (browser) {
          localStorage.removeItem('admin_token');
        }
        set({ admin: null, token: null, loading: false, isAuthenticated: false });
        return false;
      }
    }
  };
}

export const adminStore = createAdminStore();
