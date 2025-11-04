// src/components/layout/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function ProtectedRoute() {
  const { isAuth, booting } = useAuth();
  const loc = useLocation();

  if (booting) {
    return <div className="p-6">Carregando…</div>;
  }
  if (!isAuth) {
    return <Navigate to="/login" replace state={{ from: loc }} />;
  }
  return <Outlet />;
}
