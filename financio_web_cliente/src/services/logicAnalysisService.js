import { apiRequest } from './apiClient';

export const analizarFinanzasLogicas = (filtros = {}) =>
  apiRequest('/logica/analisis', {
    method: 'GET',
    query: filtros
  });
