import Watchlist from '../models/watchlistModel.js';

export const getWatchlist = async (req, res) => {
  const wl = await Watchlist.findOne({ user: req.user.id }).lean();
  res.json(wl?.itens || []);
};

export const addToWatchlist = async (req, res) => {
  const { tmdbId, titulo, posterPath, overview, releaseDate } = req.body;

  const wl = await Watchlist.findOne({ user: req.user.id });
  const exists = wl.itens.some((i) => i.tmdbId === tmdbId);
  if (exists) return res.status(409).json({ message: 'Filme já está na sua lista' });

  wl.itens.unshift({ tmdbId, titulo, posterPath, overview, releaseDate, assistido: false });
  await wl.save();
  res.status(201).json(wl.itens);
};

export const removeFromWatchlist = async (req, res) => {
  const tmdbId = parseInt(req.params.tmdbId, 10);
  const wl = await Watchlist.findOne({ user: req.user.id });
  wl.itens = wl.itens.filter((i) => i.tmdbId !== tmdbId);
  await wl.save();
  res.json(wl.itens);
};

export const setWatched = async (req, res) => {
  const tmdbId = parseInt(req.params.tmdbId, 10);
  const wl = await Watchlist.findOne({ user: req.user.id });
  const item = wl.itens.find((i) => i.tmdbId === tmdbId);
  if (!item) return res.status(404).json({ message: 'Filme não encontrado na sua lista' });

  item.assistido = !!req.body.assistido;
  await wl.save();
  res.json(wl.itens);
};
