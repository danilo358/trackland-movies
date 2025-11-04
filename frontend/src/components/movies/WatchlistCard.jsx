import React from 'react';

export default function WatchlistCard({ item, onClick, onToggle }) {
  const watched = !!item.assistido;

  return (
    <div
      className={`relative cursor-pointer rounded-xl overflow-hidden bg-neutral-900 shadow
                  transition-transform duration-200 hover:-translate-y-1 hover:scale-105
                  ${watched ? 'opacity-80 grayscale' : ''}`}
      onClick={() => onClick?.(item)}
    >
      {watched && (
        <span className="absolute left-2 top-2 z-10 text-xs px-2 py-1 rounded bg-emerald-600">
          Assistido
        </span>
      )}

      {item.posterPath ? (
        <img
          src={`https://image.tmdb.org/t/p/w342${item.posterPath}`}
          alt={item.titulo}
          className="w-full h-[300px] object-cover"
        />
      ) : (
        <div className="w-full h-[300px] bg-neutral-800" />
      )}

      <div className="p-3">
        <div className="font-semibold line-clamp-2">{item.titulo}</div>
        {typeof item.nota === 'number' && (
          <div className="text-sm opacity-70">Nota: {item.nota.toFixed(1)}</div>
        )}

        <div className="mt-2 flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onToggle?.(item, !watched); }}
            className={`px-2 py-1 rounded text-xs ${watched ? 'bg-neutral-800' : 'bg-emerald-600 hover:bg-emerald-500'}`}
            title={watched ? 'Marcar como não assistido' : 'Marcar como assistido'}
          >
            {watched ? '✓ Assistido' : 'Marcar como assistido'}
          </button>
        </div>
      </div>
    </div>
  );
}
