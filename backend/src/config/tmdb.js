import axios from 'axios';

const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3'
});

// Usa API KEY v3 como query param para simplificar
tmdb.interceptors.request.use((config) => {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    throw new Error('TMDB_API_KEY não configurada no .env');
  }
  config.params = { ...(config.params || {}), api_key: apiKey, language: 'pt-BR' };
  return config;
});

export default tmdb;
