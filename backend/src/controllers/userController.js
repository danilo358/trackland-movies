import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import Watchlist from '../models/watchlistModel.js';

export const me = async (req, res) => {
  const user = await User.findById(req.user.id).lean();
  res.json({
    id: user._id,
    nome: user.nome,
    email: user.email,
    dataNascimento: user.dataNascimento
  });
};

export const updateMe = async (req, res) => {
  const { nome, email, dataNascimento } = req.body;

  if (email) {
    const existe = await User.findOne({ email, _id: { $ne: req.user.id } });
    if (existe) return res.status(409).json({ message: 'Email já em uso por outra conta' });
  }

  const atual = await User.findByIdAndUpdate(
    req.user.id,
    { $set: { ...(nome && { nome }), ...(email && { email }), ...(dataNascimento !== undefined && { dataNascimento }) } },
    { new: true }
  ).lean();

  res.json({
    id: atual._id, nome: atual.nome, email: atual.email, dataNascimento: atual.dataNascimento
  });
};

export const changePassword = async (req, res) => {
  const { senhaAtual, novaSenha } = req.body;
  const user = await User.findById(req.user.id);
  const ok = await bcrypt.compare(senhaAtual, user.senhaHash);
  if (!ok) return res.status(400).json({ message: 'Senha atual incorreta' });

  user.senhaHash = await bcrypt.hash(novaSenha, 10);
  await user.save();
  res.json({ message: 'Senha atualizada' });
};

export const deleteMe = async (req, res) => {
  await Watchlist.deleteOne({ user: req.user.id });
  await User.findByIdAndDelete(req.user.id);
  res.json({ message: 'Conta excluída' });
};
