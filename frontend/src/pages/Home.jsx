import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Home() {
  const { isAuth } = useAuth();
  return (
    <div className="grid place-items-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold">Sua lista de filmes, simples e privada.</h1>
        <p className="text-white/80">
          Busque filmes do TheMovieDB e marque como <span className="text-brand-accent font-semibold">Para Assistir</span>.
        </p>
        <div className="flex gap-3 justify-center">
          {isAuth ? (
            <>
              <Link className="btn btn-accent" to="/search">Buscar filmes</Link>
              <Link className="btn btn-primary" to="/watchlist">Minha lista</Link>
            </>
          ) : (
            <>
              <Link className="btn btn-accent" to="/register">Criar conta</Link>
              <Link className="btn btn-primary" to="/login">Entrar</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
