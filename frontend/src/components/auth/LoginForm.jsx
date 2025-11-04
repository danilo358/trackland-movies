import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLocation, useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const loc = useLocation();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      await login(email, senha);
      const go = loc.state?.from?.pathname || '/search';
      navigate(go);
    } catch (err) {
      setErro(err?.response?.data?.message || 'Falha no login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="card p-6 max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Entrar</h1>
      {erro && <div className="text-red-400">{erro}</div>}
      <div>
        <label className="block mb-1 text-sm">Email</label>
        <input className="input" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
      </div>
      <div>
        <label className="block mb-1 text-sm">Senha</label>
        <input className="input" type="password" value={senha} onChange={(e)=>setSenha(e.target.value)} required />
      </div>
      <button className="btn btn-primary w-full" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
    </form>
  );
}
