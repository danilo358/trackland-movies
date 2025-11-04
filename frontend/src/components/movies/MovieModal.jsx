import React, { useEffect, useState } from 'react';
import { getDetails } from '../../services/movieService';
import { addToWatchlist } from '../../services/userService';

const TMDB_IMG = (p) => p ? `https://image.tmdb.org/t/p/w185${p}` : '';

export default function MovieModal({ movie, onClose }) {
  const [det, setDet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true);
      try {
        const d = await getDetails(movie.tmdbId);
        if (!cancel) setDet(d);
      } catch {
        if (!cancel) setMsg('Não foi possível carregar detalhes agora.');
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [movie.tmdbId]);

  const handleAdd = async () => {
    try {
      setSaving(true);
      await addToWatchlist({
        tmdbId: det?.tmdbId ?? movie.tmdbId,
        titulo: det?.titulo ?? movie.titulo,
        posterPath: det?.posterPath ?? movie.posterPath,
        overview: det?.overview ?? movie.overview,
        releaseDate: det?.releaseDate ?? movie.releaseDate
      });
      setMsg('Adicionado à sua lista!');
    } catch (e) {
      setMsg('Falha ao adicionar. Tente novamente.');
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
            {movie.posterPath && (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                alt={movie.titulo}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="md:w-2/3 p-5">
            <div className="flex justify-between items-start">
              <h2 className="text-xl md:text-2xl font-bold">{det?.titulo ?? movie.titulo}</h2>
              <button onClick={onClose} className="text-sm px-3 py-1 rounded bg-neutral-800 hover:bg-neutral-700">
                Fechar
              </button>
            </div>

            <div className="mt-2 text-sm opacity-70">
              Nota: {typeof (det?.nota ?? movie.nota) === 'number'
                ? (det?.nota ?? movie.nota).toFixed(1)
                : '—'}
              {det?.releaseDate && <> • Lançamento: {det.releaseDate}</>}
            </div>

            <div className="mt-4 leading-relaxed max-h-48 overflow-auto pr-1">
              {det?.overview ?? movie.overview ?? 'Sem descrição.'}
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

            <div className="mt-5 flex gap-3">
              <button
                onClick={handleAdd}
                disabled={saving}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-60"
              >
                {saving ? 'Adicionando…' : 'Adicionar à lista'}
              </button>
              {msg && <div className="text-sm opacity-80">{msg}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
