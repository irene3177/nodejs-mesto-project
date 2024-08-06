import { Router } from 'express';
import {
  getUsers,
  getUserById,
  getUserByToken,
  updateUser,
  updateUserAvatar,
} from '../controllers/users';
import authenticateJWT from '../middleware/auth';
import { updateUserAvatarValidation, updateUserValidation, userIdValidation } from '../validators/userValidator';



const router = Router();


router.get('/', authenticateJWT, getUsers);

router.get('/me', authenticateJWT, getUserByToken);

router.patch('/me', updateUserValidation, authenticateJWT, updateUser);

router.patch('/me/avatar', updateUserAvatarValidation, authenticateJWT, updateUserAvatar);

router.get('/:userId', userIdValidation, authenticateJWT, getUserById);



export default router;