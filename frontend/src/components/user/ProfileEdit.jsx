import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { changePassword, updateMe } from '../../services/userService.js';

export default function ProfileEdit() {
  const { user, refreshMe } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [msg, setMsg] = useState('');

  // password
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');

  useEffect(() => {
    if (user) {
      setNome(user.nome || '');
      setEmail(user.email || '');
      setDataNascimento(user.dataNascimento ? user.dataNascimento.slice(0,10) : '');
    }
  }, [user]);

  const salvarPerfil = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await updateMe({ nome, email, dataNascimento: dataNascimento || undefined });
      await refreshMe();
      setMsg('Perfil atualizado');
    } catch (err) {
      setMsg(err?.response?.data?.message || 'Falha ao atualizar');
    }
  };

  const trocarSenha = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await changePassword(senhaAtual, novaSenha);
      setSenhaAtual(''); setNovaSenha('');
      setMsg('Senha alterada com sucesso');
    } catch (err) {
      setMsg(err?.response?.data?.message || 'Falha ao alterar senha');
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <form onSubmit={salvarPerfil} className="card p-5 space-y-3">
        <h2 className="text-xl font-bold">Informações do Perfil</h2>
        {msg && <div className="text-brand-accent">{msg}</div>}
        <div>
          <label className="block mb-1 text-sm">Nome</label>
          <input className="input" value={nome} onChange={(e)=>setNome(e.target.value)} required />
        </div>
        <div>
          <label className="block mb-1 text-sm">Email</label>
          <input className="input" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block mb-1 text-sm">Data de nascimento</label>
          <input className="input" type="date" value={dataNascimento} onChange={(e)=>setDataNascimento(e.target.value)} />
        </div>
        <button className="btn btn-accent">Salvar</button>
      </form>

      <form onSubmit={trocarSenha} className="card p-5 space-y-3">
        <h2 className="text-xl font-bold">Alterar Senha</h2>
        <div>
          <label className="block mb-1 text-sm">Senha atual</label>
          <input className="input" type="password" value={senhaAtual} onChange={(e)=>setSenhaAtual(e.target.value)} required />
        </div>
        <div>
          <label className="block mb-1 text-sm">Nova senha</label>
          <input className="input" type="password" value={novaSenha} onChange={(e)=>setNovaSenha(e.target.value)} required />
        </div>
        <button className="btn btn-primary">Atualizar senha</button>
      </form>
    </div>
  );
}
