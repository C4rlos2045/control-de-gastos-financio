const TOKEN_KEY = 'financio_token';

export const guardarToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const obtenerToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const eliminarToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};