import { obtenerToken } from '../utils/authStorage';

const API_URL = import.meta.env.VITE_API_URL;

const construirUrl = (endpoint, query = {}) => {
  const url = new URL(`${API_URL}${endpoint}`);

  Object.entries(query).forEach(([clave, valor]) => {
    if (valor !== undefined && valor !== null && valor !== '') {
      url.searchParams.append(clave, valor);
    }
  });

  return url.toString();
};

export const apiRequest = async (
  endpoint,
  {
    method = 'GET',
    body,
    query,
    auth = true
  } = {}
) => {
  const headers = {
    'Content-Type': 'application/json'
  };

  const token = obtenerToken();

  if (auth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    construirUrl(endpoint, query),
    {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    }
  );

  const data = await response
    .json()
    .catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.mensaje || 'Error al conectar con el servidor'
    );
  }

  return data;
};

export const apiFormRequest = async (
  endpoint,
  {
    method = 'POST',
    body,
    auth = true
  } = {}
) => {
  const headers = {};

  const token = obtenerToken();

  if (auth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    construirUrl(endpoint),
    {
      method,
      headers,
      body
    }
  );

  const data = await response
    .json()
    .catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.mensaje ||
      'Error al conectar con el servidor'
    );
  }

  return data;
};