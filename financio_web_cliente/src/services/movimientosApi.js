import { apiRequest } from './apiClient';

export const movimientosApi = {
    listar: (filtros = {}) =>
        apiRequest('/movimientos', {
        query: filtros
        }),

    crear: (datos) =>
        apiRequest('/movimientos', {
        method: 'POST',
        body: datos
        }),

    actualizar: (id, datos) =>
        apiRequest(`/movimientos/${id}`, {
        method: 'PUT',
        body: datos
        }),

    eliminar: (id) =>
        apiRequest(`/movimientos/${id}`, {
        method: 'DELETE'
        })
};