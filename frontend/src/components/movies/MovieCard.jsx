import React from 'react';

export default function MovieCard({ movie, onClick }) {
  return (
    <div
      onClick={() => onClick?.(movie)}
      className="cursor-pointer rounded-xl overflow-hidden bg-neutral-900 shadow transition-transform duration-200 hover:-translate-y-1 hover:scale-105"
    >
      {movie.posterPath ? (
        <img
          src={`https://image.tmdb.org/t/p/w342${movie.posterPath}`}
          alt={movie.titulo}
          className="w-full h-[300px] object-cover"
        />
      ) : (
        <div className="w-full h-[300px] bg-neutral-800" />
      )}
      <div className="p-3">
        <div className="font-semibold line-clamp-2">{movie.titulo}</div>
        <div className="text-sm opacity-70">
          Nota: {typeof movie.nota === 'number' ? movie.nota.toFixed(1) : '—'}
        </div>
      </div>
    </div>
  );
}
