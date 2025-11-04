import React, { useEffect, useState } from 'react';
import { getWatchlist, setWatched } from '../services/userService';
import WatchlistCard from '../components/movies/WatchlistCard';
import WatchlistModal from '../components/movies/WatchlistModal';

export default function Watchlist() {
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [sel, setSel] = useState(null);

  useEffect(() => {
    let cancel = false;
    (async () => {
      setCarregando(true);
      setErro('');
      try {
        const data = await getWatchlist();
        if (!cancel) setItens(data || []);
      } catch {
        if (!cancel) setErro('Não foi possível carregar sua lista.');
      } finally {
        if (!cancel) setCarregando(false);
      }
    })();
    return () => { cancel = true; };
  }, []);

  const toggleWatched = async (item, novo) => {
    try {
      const data = await setWatched(item.tmdbId, novo);
      setItens(data || []);
    } catch {
      // feedback leve; pode usar toast aqui
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Minha Lista</h1>

      {erro && <div className="mb-3 text-yellow-400 text-sm">{erro}</div>}

      {carregando ? (
        <div>Carregando…</div>
      ) : (
        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-4">
          {itens.map((it) => (
            <WatchlistCard
              key={it.tmdbId}
              item={it}
              onClick={setSel}
              onToggle={toggleWatched}
            />
          ))}
          {!itens.length && (
            <div className="col-span-full opacity-70">
              Sua lista está vazia. Adicione filmes pela aba Buscar.
            </div>
          )}
        </div>
      )}

      {sel && (
        <WatchlistModal
          item={sel}
          onClose={() => setSel(null)}
          onAfterChange={(data) => { setItens(data || []); }}
        />
      )}
    </div>
  );
}
