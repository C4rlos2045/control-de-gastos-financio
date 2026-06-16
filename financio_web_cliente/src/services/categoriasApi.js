import { apiRequest } from './apiClient';

export const categoriasApi = {
    listar: (filtros = {}) =>
        apiRequest('/categorias', {
        query: filtros
        }),

    crear: (datos) =>
        apiRequest('/categorias', {
        method: 'POST',
        body: datos
        }),

    actualizar: (id, datos) =>
        apiRequest(`/categorias/${id}`, {
        method: 'PUT',
        body: datos
        }),

    eliminar: (id) =>
        apiRequest(`/categorias/${id}`, {
        method: 'DELETE'
        })
};