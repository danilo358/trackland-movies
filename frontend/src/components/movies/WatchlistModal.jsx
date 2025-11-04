import React, { useEffect, useState } from 'react';
import { getDetails } from '../../services/movieService';
import { removeFromWatchlist, setWatched } from '../../services/userService';

const TMDB_IMG = (p) => (p ? `https://image.tmdb.org/t/p/w185${p}` : '');

export default function WatchlistModal({ item, onClose, onAfterChange }) {
  const [det, setDet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true);
      try {
        const d = await getDetails(item.tmdbId);
        if (!cancel) setDet(d);
      } catch {
        if (!cancel) setMsg('Não foi possível carregar detalhes agora.');
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [item.tmdbId]);

  const watched = !!item.assistido;

  const doToggle = async () => {
    try {
      setSaving(true);
      const data = await setWatched(item.tmdbId, !watched);
      setMsg(!watched ? 'Marcado como assistido.' : 'Marcado como não assistido.');
      onAfterChange?.(data);
    } catch {
      setMsg('Falha ao atualizar status.');
    } finally {
      setSaving(false);
    }
  };

  const doRemove = async () => {
    try {
      setSaving(true);
      const data = await removeFromWatchlist(item.tmdbId);
      setMsg('Removido da sua lista.');
      onAfterChange?.(data);
      setTimeout(onClose, 250);
    } catch {
      setMsg('Falha ao remover.');
    } finally {
      setSaving(false);
    }
  };

  const prov = det?.providers || {};
  const ProviderRow = ({ label, items }) => (
    items?.length ? (
      <div className="mt-2">
        <div className="text-sm opacity-70">{label}</div>
        <div className="flex flex-wrap gap-3 mt-1">
          {items.map(p => (
            <div key={p.id} className="flex items-center gap-2">
              {p.logo && <img src={TMDB_IMG(p.logo)} alt={p.name} className="w-6 h-6 rounded" />}
              <span className="text-sm">{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    ) : null
  );

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                      w-[95vw] max-w-4xl bg-neutral-900 rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3">
            {item.posterPath && (
              <img
                src={`https://image.tmdb.org/t/p/w500${item.posterPath}`}
                alt={item.titulo}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="md:w-2/3 p-5">
            <div className="flex justify-between items-start">
              <h2 className="text-xl md:text-2xl font-bold">{det?.titulo ?? item.titulo}</h2>
              <button onClick={onClose} className="text-sm px-3 py-1 rounded bg-neutral-800 hover:bg-neutral-700">
                Fechar
              </button>
            </div>

            <div className="mt-2 text-sm opacity-70">
              Nota: {typeof (det?.nota ?? item.nota) === 'number'
                ? (det?.nota ?? item.nota).toFixed(1)
                : '—'}
              {det?.releaseDate && <> • Lançamento: {det.releaseDate}</>}
              {watched && <> • <span className="text-emerald-400">Assistido</span></>}
            </div>

            <div className="mt-4 leading-relaxed max-h-48 overflow-auto pr-1">
              {det?.overview ?? item.overview ?? 'Sem descrição.'}
            </div>

            <div className="mt-4">
              <div className="font-semibold">Onde assistir</div>
              <ProviderRow label="Streaming" items={prov.stream} />
              <ProviderRow label="Aluguel"   items={prov.rent} />
              <ProviderRow label="Compra"    items={prov.buy} />
              {!prov.stream?.length && !prov.rent?.length && !prov.buy?.length && (
                <div className="text-sm opacity-70 mt-2">Sem provedores para o Brasil informados.</div>
              )}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={doToggle}
                disabled={saving}
                className={`px-4 py-2 rounded ${watched ? 'bg-neutral-800 hover:bg-neutral-700' : 'bg-emerald-600 hover:bg-emerald-500'} disabled:opacity-60`}
              >
                {watched ? '✓ Assistido' : 'Marcar como assistido'}
              </button>
              <button
                onClick={doRemove}
                disabled={saving}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-500 disabled:opacity-60"
              >
                Remover da lista
              </button>
              {msg && <div className="text-sm opacity-80">{msg}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
