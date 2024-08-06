import { Router } from 'express';
import {
  getUsers,
  getUserById,
  getUserByToken,
  updateUser,
  updateUserAvatar,
} from '../controllers/users';
import { updateUserAvatarValidation, updateUserValidation, userIdValidation } from '../validators/userValidator';

const router = Router();

router.get('/', getUsers);
router.get('/me', getUserByToken);
router.patch('/me', updateUserValidation, updateUser);
router.patch('/me/avatar', updateUserAvatarValidation, updateUserAvatar);
router.get('/:userId', userIdValidation, getUserById);

export default router;
