// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as auth from '../services/authService';
import api from '../services/api';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  // carrega sessão existente
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setBooting(false); return; }
    (async () => {
      try {
        const me = await auth.me();
        setUser(me);
      } catch {
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setBooting(false);
      }
    })();
  }, []);

  const login = async (email, senha) => {
    const { token, usuario } = await auth.login(email, senha);
    localStorage.setItem('token', token);
    setUser(usuario);
    return usuario;
  };

  const register = async (payload) => {
    const { token, usuario } = await auth.register(payload);
    localStorage.setItem('token', token);
    setUser(usuario);
    return usuario;
  };

  const logout = async () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = useMemo(() => ({
    user,
    isAuth: !!user,
    booting,
    login,
    register,
    logout,
  }), [user, booting]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
