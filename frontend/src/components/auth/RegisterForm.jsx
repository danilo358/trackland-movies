import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function RegisterForm() {
  const { register } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErro(''); setLoading(true);
    try {
      await register({ nome, email, senha, dataNascimento: dataNascimento || undefined });
      navigate('/search');
    } catch (err) {
      setErro(err?.response?.data?.message || 'Falha no cadastro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="card p-6 max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Criar conta</h1>
      {erro && <div className="text-red-400">{erro}</div>}
      <div>
        <label className="block mb-1 text-sm">Nome *</label>
        <input className="input" value={nome} onChange={(e)=>setNome(e.target.value)} required />
      </div>
      <div>
        <label className="block mb-1 text-sm">Email *</label>
        <input className="input" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
      </div>
      <div>
        <label className="block mb-1 text-sm">Senha *</label>
        <input className="input" type="password" value={senha} onChange={(e)=>setSenha(e.target.value)} required
               placeholder="Mín. 8, com número e caractere especial" />
      </div>
      <div>
        <label className="block mb-1 text-sm">Data de nascimento (opcional)</label>
        <input className="input" type="date" value={dataNascimento} onChange={(e)=>setDataNascimento(e.target.value)} />
      </div>
      <button className="btn btn-accent w-full" disabled={loading}>
        {loading ? 'Criando...' : 'Criar conta'}
      </button>
    </form>
  );
}
