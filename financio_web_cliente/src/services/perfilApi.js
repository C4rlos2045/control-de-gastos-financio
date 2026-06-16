import { apiRequest, apiFormRequest } from './apiClient';

export const perfilApi = {
  obtenerPerfil: () =>
    apiRequest('/perfil'),

  actualizarPerfil: (datos) =>
    apiRequest('/perfil', {
      method: 'PUT',
      body: datos
    }),

  actualizarAvatar: (archivo) => {
    const formData = new FormData();

    formData.append('avatar', archivo);

    return apiFormRequest('/perfil/avatar', {
      method: 'PUT',
      body: formData
    });
  },

  actualizarPassword: (datos) =>
    apiRequest('/perfil/password', {
      method: 'PUT',
      body: datos
    })
};