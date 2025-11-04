import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Navbar() {
  const { isAuth, user, logout } = useAuth();
  const navigate = useNavigate();
  const active = ({ isActive }) =>
    'px-3 py-2 rounded-lg ' + (isActive ? 'bg-white/10 text-brand-accent' : 'hover:bg-white/5');

  return (
    <header className="sticky top-0 z-50 bg-black/40 backdrop-blur border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-brand-primary shadow-glow" />
          <span className="font-extrabold tracking-wide">Trackland Movies</span>
        </Link>
        <nav className="flex items-center gap-2">
          <NavLink className={active} to="/">Início</NavLink>
          {isAuth && <NavLink className={active} to="/search">Buscar</NavLink>}
          {isAuth && <NavLink className={active} to="/watchlist">Minha Lista</NavLink>}
          {isAuth ? (
            <>
              <NavLink className={active} to="/profile">{user?.nome?.split(' ')[0] || 'Perfil'}</NavLink>
              <button className="btn btn-accent ml-2" onClick={() => { logout(); navigate('/'); }}>
                Sair
              </button>
            </>
          ) : (
            <>
              <NavLink className={active} to="/login">Entrar</NavLink>
              <NavLink className="px-3 py-2 rounded-lg bg-brand-primary" to="/register">Criar conta</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
