import { Router } from 'express';
import { auth } from '../middleware/authMiddleware.js';
import { validar } from '../middleware/validationMiddleware.js';
import { addWatchlistValidator, movieIdParamValidator } from '../utils/validators.js';
import { getWatchlist, addToWatchlist, removeFromWatchlist, setWatched } from '../controllers/watchlistController.js';

const router = Router();

router.get('/', auth, getWatchlist);
router.post('/', auth, addWatchlistValidator, validar, addToWatchlist);
router.delete('/:tmdbId', auth, movieIdParamValidator, validar, removeFromWatchlist);
router.patch('/:tmdbId/watched', auth, movieIdParamValidator, validar, setWatched);

export default router;
