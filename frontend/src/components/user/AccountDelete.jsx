import React, { useState } from 'react';
import { deleteMe } from '../../services/userService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function AccountDelete() {
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState('');
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const excluir = async () => {
    if (confirm !== user?.email) {
      setMsg('Digite seu email exatamente para confirmar');
      return;
    }
    await deleteMe();
    logout();
    navigate('/');
  };

  return (
    <div className="card p-5">
      <h2 className="text-xl font-bold mb-2">Excluir Conta</h2>
      <p className="text-white/80 mb-3">A exclusão é definitiva. Para confirmar, digite seu email abaixo.</p>
      {msg && <div className="text-brand-accent mb-2">{msg}</div>}
      <input className="input mb-3" value={confirm} onChange={(e)=>setConfirm(e.target.value)} placeholder={user?.email || 'seu@email'} />
      <button className="btn btn-primary" onClick={excluir}>Excluir minha conta</button>
    </div>
  );
}
