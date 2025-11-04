// server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDatabase } from './config/database.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import watchlistRoutes from './routes/watchlistRoutes.js';
import { randomGoodMovies } from './controllers/movieController.js';

const app = express();

app.set('trust proxy', 1);

// Segurança básica
app.use(helmet({ crossOriginResourcePolicy: false }));

// Body parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Logs
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

// CORS (aceita lista separada por vírgula)
const origins = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim());
app.use(cors({ origin: origins, credentials: true }));

// Healthcheck
app.get('/health', (_req, res) => res.json({ ok: true }));

// Rotas da API
// -> Aqui já entram /api/auth/login e /api/auth/register vindas do authRoutes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/watchlist', watchlistRoutes);
app.use('/movies/random-good', randomGoodMovies);
app.use('/movies', movieRoutes);

// 404 apenas para caminhos da API
app.use('/*', (req, res) => res.status(404).json({ message: 'Rota não encontrada' }));

// Handler de erro
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('Erro:', err);
  res.status(err.status || 500).json({ message: err.message || 'Erro interno' });
});

// Start
const PORT = Number(process.env.PORT || 4000);
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

connectDatabase(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`API ouvindo em http://localhost:4000`));
  })
  .catch((err) => {
    console.error('Falha ao conectar no banco:', err);
    process.exit(1);
  });

export default app;
