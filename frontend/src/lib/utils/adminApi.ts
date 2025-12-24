import { browser } from '$app/environment';

const API_BASE = 'http://localhost:3000/api';

function getAuthHeaders() {
  const token = browser ? localStorage.getItem('admin_token') : null;
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}

async function handleResponse(response: Response) {
  if (response.status === 401) {
    // Unauthorized - redirect to login
    if (browser) {
      localStorage.removeItem('admin_token');
      window.location.href = '/admin/login';
    }
    throw new Error('Unauthorized');
  }
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Request failed');
  }
  
  return response.json();
}

export const adminApi = {
  // Programs
  programs: {
  getAll: async () => {
    const response = await fetch(`${API_BASE}/admin/programs`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },
  
  getById: async (id: number) => {
    const response = await fetch(`${API_BASE}/admin/programs/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },
  
  create: async (data: any) => {
    const response = await fetch(`${API_BASE}/admin/programs`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  
  update: async (id: number, data: any) => {
    const response = await fetch(`${API_BASE}/admin/programs/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  
  delete: async (id: number) => {
    const response = await fetch(`${API_BASE}/admin/programs/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
},

// News
news: {
  getAll: async () => {
    const response = await fetch(`${API_BASE}/admin/news`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },
  
  getById: async (id: number) => {
    const response = await fetch(`${API_BASE}/admin/news/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },
  
  create: async (data: any) => {
    const response = await fetch(`${API_BASE}/admin/news`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  
  update: async (id: number, data: any) => {
    const response = await fetch(`${API_BASE}/admin/news/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  
  delete: async (id: number) => {
    const response = await fetch(`${API_BASE}/admin/news/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
},

  // Donations
  donations: {
    getAll: async () => {
      const response = await fetch(`${API_BASE}/admin/donations`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    },
    
    updateStatus: async (id: number, status: string) => {
      const response = await fetch(`${API_BASE}/admin/donations/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      return handleResponse(response);
    },

    sendThankYouEmail: async (id: number) => {
      const response = await fetch(`${API_BASE}/admin/donations/${id}/send-email`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    }
  },

  // Volunteers
  volunteers: {
    getAll: async () => {
      const response = await fetch(`${API_BASE}/admin/volunteers`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    },
    
    updateStatus: async (id: number, status: string) => {
      const response = await fetch(`${API_BASE}/admin/volunteers/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      return handleResponse(response);
    },
    
    delete: async (id: number) => {
      const response = await fetch(`${API_BASE}/admin/volunteers/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    }
  },

  // Contacts
  contacts: {
    getAll: async () => {
      const response = await fetch(`${API_BASE}/admin/contacts`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    },
    
    updateStatus: async (id: number, status: string) => {
      const response = await fetch(`${API_BASE}/admin/contacts/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      return handleResponse(response);
    },

    sendReply: async (id: number, reply: string) => {
      const response = await fetch(`${API_BASE}/admin/contacts/${id}/reply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ reply })
      });
      return handleResponse(response);
    },

    delete: async (id: number) => {
      const response = await fetch(`${API_BASE}/admin/contacts/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    }
  },

  // Team
  team: {
    getAll: async () => {
      const response = await fetch(`${API_BASE}/admin/team`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    },
    
    create: async (data: any) => {
      const response = await fetch(`${API_BASE}/admin/team`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    },
    
    update: async (id: number, data: any) => {
      const response = await fetch(`${API_BASE}/admin/team/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    },
    
    delete: async (id: number) => {
      const response = await fetch(`${API_BASE}/admin/team/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    }
  }
};
