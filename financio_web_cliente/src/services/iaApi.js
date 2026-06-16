import { apiRequest } from './apiClient';

export const iaApi = {
    generarRecomendacion: (datos) =>
        apiRequest('/ia/recomendacion', {
        method: 'POST',
        body: datos
        })
};