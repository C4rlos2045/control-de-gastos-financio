import { apiRequest } from './apiClient';

export const perfilApi = {
  obtenerPerfil: () =>
    apiRequest('/perfil'),

  actualizarPerfil: (datos) =>
    apiRequest('/perfil', {
      method: 'PUT',
      body: datos
    }),

  actualizarPassword: (datos) =>
    apiRequest('/perfil/password', {
      method: 'PUT',
      body: datos
    })
};