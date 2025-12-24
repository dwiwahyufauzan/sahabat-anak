import { env } from '$env/dynamic/public';

const API_URL = env.PUBLIC_API_URL || 'http://localhost:3000';

interface ApiOptions extends RequestInit {
  token?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { token, ...fetchOptions } = options;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add custom headers if provided
    if (fetchOptions.headers) {
      Object.assign(headers, fetchOptions.headers);
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Programs
  async getPrograms() {
    return this.request('/api/programs');
  }

  async getProgramBySlug(slug: string) {
    return this.request(`/api/programs/${slug}`);
  }

  // News
  async getNews() {
    return this.request('/api/news');
  }

  async getNewsBySlug(slug: string) {
    return this.request(`/api/news/${slug}`);
  }

  // Donations
  async createDonation(data: {
    programId?: number;
    donorName: string;
    donorEmail: string;
    donorPhone?: string;
    amount: string;
    isAnonymous?: number;
    paymentMethod?: string;
    message?: string;
  }) {
    return this.request('/api/donations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Volunteers
  async createVolunteer(data: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    skills?: string;
    motivation?: string;
    availability?: string;
  }) {
    return this.request('/api/volunteers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Contact
  async createContact(data: {
    name: string;
    email: string;
    subject?: string;
    message: string;
  }) {
    return this.request('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Admin - Auth
  async login(username: string, password: string) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async register(data: {
    username: string;
    email: string;
    password: string;
    fullName: string;
    role?: 'super_admin' | 'admin' | 'editor';
  }) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProfile(token: string) {
    return this.request('/api/auth/me', { token });
  }

  // Admin - Programs
  async getAdminPrograms(token: string) {
    return this.request('/api/admin/programs', { token });
  }

  async getAdminProgramById(id: number, token: string) {
    return this.request(`/api/admin/programs/${id}`, { token });
  }

  async createProgram(data: any, token: string) {
    return this.request('/api/admin/programs', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
  }

  async updateProgram(id: number, data: any, token: string) {
    return this.request(`/api/admin/programs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    });
  }

  async deleteProgram(id: number, token: string) {
    return this.request(`/api/admin/programs/${id}`, {
      method: 'DELETE',
      token,
    });
  }

  // Admin - News
  async getAdminNews(token: string) {
    return this.request('/api/admin/news', { token });
  }

  async getAdminNewsById(id: number, token: string) {
    return this.request(`/api/admin/news/${id}`, { token });
  }

  async createNews(data: any, token: string) {
    return this.request('/api/admin/news', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
  }

  async updateNews(id: number, data: any, token: string) {
    return this.request(`/api/admin/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    });
  }

  async deleteNews(id: number, token: string) {
    return this.request(`/api/admin/news/${id}`, {
      method: 'DELETE',
      token,
    });
  }

  // Admin - Donations
  async getAdminDonations(token: string) {
    return this.request('/api/admin/donations', { token });
  }

  async updateDonationStatus(id: number, status: 'pending' | 'completed' | 'failed', token: string) {
    return this.request(`/api/admin/donations/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
      token,
    });
  }

  // Admin - Volunteers
  async getAdminVolunteers(token: string) {
    return this.request('/api/admin/volunteers', { token });
  }

  async updateVolunteerStatus(id: number, status: 'pending' | 'approved' | 'rejected', token: string) {
    return this.request(`/api/admin/volunteers/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
      token,
    });
  }

  // Admin - Contacts
  async getAdminContacts(token: string) {
    return this.request('/api/admin/contacts', { token });
  }

  async updateContactStatus(id: number, status: 'unread' | 'read' | 'replied', token: string) {
    return this.request(`/api/admin/contacts/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
      token,
    });
  }

  async sendContactReply(id: number, reply: string, token: string) {
    return this.request(`/api/admin/contacts/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ reply }),
      token,
    });
  }

  async deleteContact(id: number, token: string) {
    return this.request(`/api/admin/contacts/${id}`, {
      method: 'DELETE',
      token,
    });
  }

  // Admin - Team
  async getAdminTeam(token: string) {
    return this.request('/api/admin/team', { token });
  }

  async createTeamMember(data: any, token: string) {
    return this.request('/api/admin/team', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
  }

  async updateTeamMember(id: number, data: any, token: string) {
    return this.request(`/api/admin/team/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    });
  }

  async deleteTeamMember(id: number, token: string) {
    return this.request(`/api/admin/team/${id}`, {
      method: 'DELETE',
      token,
    });
  }

  // Team (Public)
  async getTeam() {
    return this.request('/api/team');
  }
}

export const api = new ApiClient(API_URL);
