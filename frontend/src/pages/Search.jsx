import React, { useEffect, useState } from 'react';
import { getRandomGood, search } from '../services/movieService';
import MovieCard from '../components/movies/MovieCard';
import MovieModal from '../components/movies/MovieModal';

const CACHE_KEY = 'search.randomGood.last';

export default function Search() {
  const [termo, setTermo] = useState('');
  const [filmes, setFilmes] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CACHE_KEY)) ?? []; } catch { return []; }
  });
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [selecionado, setSelecionado] = useState(null);

  useEffect(() => {
    let cancel = false;
    (async () => {
      setCarregando(true); setErro('');
      try {
        let data = await getRandomGood();
        if (!data?.length) data = await getRandomGood();  // retry simples
        if (!cancel && data?.length) {
          setFilmes(data);
          localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        }
      } catch {
        if (!cancel) setErro('Não foi possível carregar sugestões agora.');
      } finally {
        if (!cancel) setCarregando(false);
      }
    })();
    return () => { cancel = true; };
  }, []);

  const onBuscar = async (e) => {
    e?.preventDefault?.();
    setCarregando(true); setErro('');
    try {
      const t = termo.trim();
      let data = t ? await search(t) : await getRandomGood();
      if (!data?.length) {
        const raw = localStorage.getItem(CACHE_KEY);
        data = raw ? JSON.parse(raw) : [];
      }
      setFilmes(data);
      if (!t && data.length) localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch {
      const raw = localStorage.getItem(CACHE_KEY);
      setFilmes(raw ? JSON.parse(raw) : []);
      setErro('Falha na busca. Mostrando últimas sugestões.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={onBuscar} className="mb-4 flex gap-2">
        <input
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          placeholder="Buscar filmes…"
          className="border px-3 py-2 rounded w-full bg-neutral-800"
        />
        <button className="px-4 py-2 rounded bg-blue-600 text-white">Buscar</button>
      </form>

      {erro && <div className="mb-3 text-yellow-400 text-sm">{erro}</div>}

      {carregando ? (
        <div>Carregando…</div>
      ) : (
        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-4">
          {filmes.map((f) => (
            <MovieCard key={f.tmdbId} movie={f} onClick={setSelecionado} />
          ))}
          {!filmes.length && (
            <div className="col-span-full opacity-70">Sem resultados no momento. Tente novamente.</div>
          )}
        </div>
      )}

      {selecionado && (
        <MovieModal movie={selecionado} onClose={() => setSelecionado(null)} />
      )}
    </div>
  );
}
