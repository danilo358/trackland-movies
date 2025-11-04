import { Router } from 'express';
import { register, login } from '../controllers/authController.js';
import { validar } from '../middleware/validationMiddleware.js';
import { registerValidator, loginValidator } from '../utils/validators.js';

const router = Router();

router.post('/register', registerValidator, validar, register);
router.post('/login',    loginValidator,    validar, login);

export default router;
