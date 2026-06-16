import { apiRequest } from './apiClient';

export const authApi = {
  register: (datos) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: datos,
      auth: false
    }),

  login: (datos) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: datos,
      auth: false
    }),

  me: () =>
    apiRequest('/auth/me')
};