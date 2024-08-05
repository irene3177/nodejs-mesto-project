import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { getCards, createCard, deleteCardById, likeCard, dislikeCard } from '../controllers/cards';
import authenticateJWT from '../middleware/auth';

const router = Router();

router.get('/', authenticateJWT, getCards);
router.post('/', authenticateJWT, createCard);
router.delete('/:cardId',celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), authenticateJWT, deleteCardById);
router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), authenticateJWT, likeCard);
router.delete('/:cardId/likes',celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), authenticateJWT, dislikeCard)

export default router;
