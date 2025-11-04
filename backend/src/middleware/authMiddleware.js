import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Não autenticado' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub).lean();
    if (!user) return res.status(401).json({ message: 'Sessão inválida' });

    req.user = { id: user._id.toString(), email: user.email, nome: user.nome };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};
export default auth;