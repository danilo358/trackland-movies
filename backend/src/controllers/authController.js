import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import Watchlist from '../models/watchlistModel.js';

const signToken = (userId) =>
  jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const register = async (req, res) => {
  const { nome, email, senha, dataNascimento } = req.body;

  const existente = await User.findOne({ email });
  if (existente) {
    return res.status(409).json({ message: 'Email já cadastrado' });
  }

  const senhaHash = await bcrypt.hash(senha, 10);
  const user = await User.create({ nome, email, senhaHash, dataNascimento: dataNascimento || null });

  // cria watchlist vazia para o usuário (1:1)
  await Watchlist.create({ user: user._id, itens: [] });

  const token = signToken(user._id.toString());
  res.status(201).json({
    token,
    usuario: { id: user._id, nome: user.nome, email: user.email, dataNascimento: user.dataNascimento }
  });
};

export const login = async (req, res) => {
  const { email, senha } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Credenciais inválidas' });

  const ok = await bcrypt.compare(senha, user.senhaHash);
  if (!ok) return res.status(401).json({ message: 'Credenciais inválidas' });

  const token = signToken(user._id.toString());
  res.json({
    token,
    usuario: { id: user._id, nome: user.nome, email: user.email, dataNascimento: user.dataNascimento }
  });
};
