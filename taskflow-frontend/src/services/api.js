import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

const normalizeUser = (user) => ({
  ...user,
  role: user?.role?.replace('ROLE_', ''),
});

const storeSession = (data) => {
  const user = normalizeUser(data);
  localStorage.setItem('token', user.token);
  localStorage.setItem('user', JSON.stringify(user));
  return user;
};

// Request interceptor to add the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  login: async (credentials) => {
    authService.logout();
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      return storeSession(response.data);
    }
    return normalizeUser(response.data);
  },
  register: async (data) => {
    authService.logout();
    const response = await api.post('/auth/register', data);
    if (response.data.token) {
      return storeSession(response.data);
    }
    return normalizeUser(response.data);
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return normalizeUser(JSON.parse(userStr));
  }
};

export const projectService = {
  getAll: async () => {
    const response = await api.get('/projects');
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/projects', data);
    return response.data;
  },
  delete: async (projectId) => {
    await api.delete(`/projects/${projectId}`);
  },
  addMember: async (projectId, userId) => {
    const response = await api.post(`/projects/${projectId}/members/${userId}`);
    return response.data;
  }
};

export const userService = {
  getMembers: async () => {
    const response = await api.get('/users/members');
    return response.data;
  }
};

export const taskService = {
  getByProject: async (projectId) => {
    const response = await api.get(`/tasks/project/${projectId}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/tasks', data);
    return response.data;
  },
  updateStatus: async (taskId, status) => {
    const response = await api.put(`/tasks/${taskId}/status?status=${status}`);
    return response.data;
  }
};

export const activityService = {
  getRecent: async () => {
    const response = await api.get('/activity/recent');
    return response.data;
  }
};

export default api;
