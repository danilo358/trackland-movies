import api from './api';

export const updateMe = async (payload) => {
  const { data } = await api.put('/users/me', payload);
  return data;
};

export const changePassword = async (senhaAtual, novaSenha) => {
  const { data } = await api.put('/users/me/password', { senhaAtual, novaSenha });
  return data;
};

export const deleteMe = async () => {
  const { data } = await api.delete('/users/me');
  return data;
};

export const getWatchlist = async () => {
  const { data } = await api.get('/watchlist');
  return data;
};

export const addToWatchlist = async (movie) => {
  // garanta que tmdbId exista; adapte o mapeamento conforme seu objeto
  const payload = {
    tmdbId: Number(movie.tmdbId ?? movie.id),
    titulo: movie.titulo ?? movie.title,
    posterPath: movie.posterPath ?? movie.poster_path,
    overview: movie.overview,
    releaseDate: movie.releaseDate ?? movie.release_date
  };
  const { data } = await api.post('/watchlist', payload);
  return data;
};

export const removeFromWatchlist = async (tmdbId) => {
  const { data } = await api.delete(`/watchlist/${tmdbId}`);
  return data;
};

export const setWatched = async (tmdbId, assistido) => {
  const { data } = await api.patch(`/watchlist/${tmdbId}/watched`, { assistido });
  return data;
};
