// backend/src/routes/movieRoutes.js
import { Router } from 'express';
import { auth } from '../middleware/authMiddleware.js';
import { searchMovies, randomGoodMovies, getMovieDetails } from '../controllers/movieController.js';
import { searchValidator } from '../utils/validators.js';
import { validar } from '../middleware/validationMiddleware.js';

const router = Router();

router.get('/search', auth, searchValidator, validar, searchMovies);
router.get('/random-good', auth, randomGoodMovies);
router.get('/:id', auth, getMovieDetails);

export default router;
