import tmdb from '../config/tmdb.js';

export const searchMovies = async (req, res) => {
  try {
    const q = req.query.q || req.query.query;
    if (!q) return res.status(400).json({ error: 'Parâmetro q é obrigatório' });

    const { data } = await tmdb.get('/search/movie', {
      params: { query: q, include_adult: false },
    });

    const itens = (data.results || []).map((m) => ({
      tmdbId: m.id,
      titulo: m.title || m.name,
      posterPath: m.poster_path,
      overview: m.overview,
      releaseDate: m.release_date || m.first_air_date,
      nota: m.vote_average, // <- AQUI
    }));

    res.json(itens);
  } catch (err) {
    console.error('TMDB search error:', err?.response?.status, err?.response?.data || err.message);
    res.status(err?.response?.status || 500).json({ error: 'Falha ao buscar filmes' });
  }
};

export const getMovieDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = await tmdb.get(`/movie/${id}`, {
      params: { append_to_response: 'credits,videos,watch/providers' },
    });

    const prov = data['watch/providers']?.results?.BR || {};
    const normalize = (arr = []) => arr.map(p => ({
      id: p.provider_id, name: p.provider_name, logo: p.logo_path
    }));

    res.json({
      tmdbId: data.id,
      titulo: data.title,
      posterPath: data.poster_path,
      overview: data.overview,
      releaseDate: data.release_date,
      nota: data.vote_average,
      providers: {
        stream: normalize(prov.flatrate),
        rent: normalize(prov.rent),
        buy: normalize(prov.buy),
      },
    });
  } catch (err) {
    console.error('TMDB details error:', err?.response?.status, err?.response?.data || err.message);
    res.status(err?.response?.status || 500).json({ error: 'Falha ao buscar detalhes' });
  }
};

export const randomGoodMovies = async (req, res) => {
  try {
    const baseParams = {
      sort_by: 'vote_average.desc',
      'vote_count.gte': 500,      // evita notas infladas
      'vote_average.gte': 7.0,    // "boas" notas
      include_adult: false,
      page: 1,
    };

    // 1) pega total_pages
    const first = await tmdb.get('/discover/movie', { params: baseParams });
    const totalPages = Math.max(1, Math.min(Number(first?.data?.total_pages || 1), 500));

    let candidatos = first?.data?.results || [];

    // 2) até 3 tentativas em páginas aleatórias dentro do limite real
    for (let tent = 0; tent < 3 && candidatos.length < 5; tent++) {
      const page = 1 + Math.floor(Math.random() * totalPages);
      const { data } = await tmdb.get('/discover/movie', {
        params: { ...baseParams, page },
      });
      candidatos = candidatos.concat(data?.results || []);
    }

    // 3) fallback para trending se ainda estiver vazio
    if (!candidatos || candidatos.length === 0) {
      const { data } = await tmdb.get('/trending/movie/week');
      candidatos = data?.results || [];
    }

    // 4) normaliza, embaralha e limita
    let itens = candidatos
      .map((m) => ({
        tmdbId: m.id,
        titulo: m.title || m.name,
        posterPath: m.poster_path,
        overview: m.overview,
        releaseDate: m.release_date || m.first_air_date,
        nota: m.vote_average,
      }))
      .filter((i) => i.tmdbId);

    for (let i = itens.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [itens[i], itens[j]] = [itens[j], itens[i]];
    }

    const limit = Math.min(Number(req.query.limit) || 20, 40);
    res.json(itens.slice(0, limit));
  } catch (err) {
    console.error('TMDB random-good error:', err?.response?.status, err?.response?.data || err.message);
    res.status(err?.response?.status || 500).json({ error: 'Falha ao buscar recomendações' });
  }
};