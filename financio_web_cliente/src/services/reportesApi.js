import { apiRequest } from './apiClient';

export const reportesApi = {
    resumen: (filtros = {}) =>
        apiRequest('/reportes/resumen', {
        query: filtros
        }),

    gastosPorCategoria: (filtros = {}) =>
        apiRequest('/reportes/gastos-categoria', {
        query: filtros
        }),

    movimientosPorMes: (filtros = {}) =>
        apiRequest('/reportes/movimientos-mes', {
        query: filtros
        })
};