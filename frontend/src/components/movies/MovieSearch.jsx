import React, { useMemo, useState } from 'react';
import { search } from '../../services/movieService.js';
import { addToWatchlist } from '../../services/userService.js';

export default function MovieSearch({ currentWatchlist = [], onRefreshWatchlist }) {
  const [q, setQ] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const ids = useMemo(() => new Set(currentWatchlist.map(i => i.tmdbId)), [currentWatchlist]);

  const doSearch = async (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    setLoading(true);
    try {
      const res = await search(q.trim());
      setData(res);
    } finally { setLoading(false); }
  };

  const add = async (movie) => {
    await addToWatchlist(movie);
    onRefreshWatchlist?.();
  };

  return (
    <div className="space-y-4">
      <form onSubmit={doSearch} className="flex gap-2">
        <input className="input flex-1" placeholder="Busque por título..." value={q} onChange={(e)=>setQ(e.target.value)} />
        <button className="btn btn-accent" disabled={loading}>{loading ? 'Buscando...' : 'Buscar'}</button>
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        {data.map(m => (
          <MovieCard key={m.tmdbId} movie={m} inWatchlist={ids.has(m.tmdbId)} onAdd={add} />
        ))}
      </div>
    </div>
  );
}

function MovieCard({ movie, onAdd, inWatchlist }) {
  const poster = movie.posterPath ? `https://image.tmdb.org/t/p/w342${movie.posterPath}` : null;
  return (
    <div className="card p-3 flex gap-3">
      <div className="w-24 shrink-0">
        {poster ? <img className="rounded-md" src={poster} alt={movie.titulo} /> :
          <div className="w-24 h-36 bg-white/10 rounded-md grid place-items-center text-xs">Sem poster</div>}
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-lg">{movie.titulo}</h3>
        <div className="text-white/70 text-sm mb-2">{movie.releaseDate}</div>
        <p className="text-white/80 line-clamp-3">{movie.overview || 'Sem descrição'}</p>
        <div className="mt-3">
          <button className="btn btn-primary" disabled={inWatchlist} onClick={() => onAdd(movie)}>
            {inWatchlist ? 'Já na lista' : 'Para Assistir'}
          </button>
        </div>
      </div>
    </div>
  );
}
