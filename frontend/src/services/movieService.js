import api from './api';

export const search = async (q) => {
  const { data } = await api.get('/movies/search', { params: { q } });
  return data;
};

export const getRandomGood = async () => {
  const { data } = await api.get('/movies/random-good');
  return data;
};

export const getDetails = async (id) => {
  const { data } = await api.get(`/movies/${id}`);
  return data;
};