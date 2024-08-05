import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getUsers,
  getUserById,
  getUserByToken,
  updateUser,
  updateUserAvatar,
} from '../controllers/users';
import authenticateJWT from '../middleware/auth';
import { urlRegex } from '../models/users';


const router = Router();


router.get('/', authenticateJWT, getUsers);

router.get('/me', authenticateJWT, getUserByToken);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().max(30),
    about: Joi.string().max(200),
  }),
}), authenticateJWT, updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(urlRegex),
  }),
}), authenticateJWT, updateUserAvatar);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), authenticateJWT, getUserById);



export default router;