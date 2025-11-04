import { Router } from 'express';
import { auth } from '../middleware/authMiddleware.js';
import { validar } from '../middleware/validationMiddleware.js';
import { updateUserValidator, changePasswordValidator } from '../utils/validators.js';
import { me, updateMe, changePassword, deleteMe } from '../controllers/userController.js';

const router = Router();

router.get('/me', auth, me);
router.put('/me', auth, updateUserValidator, validar, updateMe);
router.put('/me/password', auth, changePasswordValidator, validar, changePassword);
router.delete('/me', auth, deleteMe);

export default router;
