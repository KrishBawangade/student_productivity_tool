import { Router } from 'express';
import { UserController } from '../controllers/userController.js';

const router = Router();
const userController = new UserController();

// /api/v1/user
router.get('/', userController.getProfile);
router.put('/', userController.updateProfile);
router.post('/xp', userController.addXp);
router.post('/streak', userController.manageStreak);

export default router;
