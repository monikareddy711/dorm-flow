import {
  AuthResponse,
  Building,
  CreateIssueDto,
  Issue,
  LoginDto,
  RegisterDto,
  User,
  Comment,
  IssueStatusHistory,
} from '@dormflow/shared-types';

const API_BASE = '/api';

function getHeaders(): HeadersInit {
  const token = localStorage.getItem('dormflow_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Auth
  async login(dto: LoginDto): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Login failed');
    }
    const data: AuthResponse = await res.json();
    localStorage.setItem('dormflow_token', data.accessToken);
    localStorage.setItem('dormflow_user', JSON.stringify(data.user));
    return data;
  },

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Registration failed');
    }
    const data: AuthResponse = await res.json();
    localStorage.setItem('dormflow_token', data.accessToken);
    localStorage.setItem('dormflow_user', JSON.stringify(data.user));
    return data;
  },

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem('dormflow_token');
    if (!token) return null;
    try {
      const res = await fetch(`${API_BASE}/auth/me`, { headers: getHeaders() });
      if (!res.ok) {
        this.logout();
        return null;
      }
      return await res.json();
    } catch {
      return null;
    }
  },

  logout(): void {
    localStorage.removeItem('dormflow_token');
    localStorage.removeItem('dormflow_user');
  },

  // Buildings
  async getBuildings(): Promise<Building[]> {
    const res = await fetch(`${API_BASE}/buildings`);
    if (!res.ok) throw new Error('Failed to load buildings');
    return await res.json();
  },

  // Issues
  async getIssues(params?: {
    buildingId?: string;
    category?: string;
    urgency?: string;
    status?: string;
    search?: string;
    mineOnly?: boolean;
    userId?: string;
  }): Promise<{ data: Issue[]; total: number }> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query.append(key, String(value));
        }
      });
    }
    const res = await fetch(`${API_BASE}/issues?${query.toString()}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load issues');
    return await res.json();
  },

  async getIssue(id: string): Promise<Issue> {
    const res = await fetch(`${API_BASE}/issues/${id}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to load issue');
    return await res.json();
  },

  async createIssue(dto: CreateIssueDto): Promise<Issue> {
    const res = await fetch(`${API_BASE}/issues`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(dto),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to submit issue');
    }
    return await res.json();
  },

  async followIssue(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/issues/${id}/followers`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to follow issue');
  },

  async unfollowIssue(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/issues/${id}/followers/me`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to unfollow issue');
  },

  // History & Comments
  async getIssueHistory(id: string): Promise<IssueStatusHistory[]> {
    const res = await fetch(`${API_BASE}/issues/${id}/history`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load history');
    return await res.json();
  },

  async getComments(id: string): Promise<Comment[]> {
    const res = await fetch(`${API_BASE}/issues/${id}/comments`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load comments');
    return await res.json();
  },

  async addComment(id: string, content: string): Promise<Comment> {
    const res = await fetch(`${API_BASE}/issues/${id}/comments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error('Failed to add comment');
    return await res.json();
  },
};
