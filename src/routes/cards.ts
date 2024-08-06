import { Router } from 'express';
import {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} from '../controllers/cards';
import authenticateJWT from '../middleware/auth';
import { cardIdValidation, createCardValidation } from '../validators/cardValidator';

const router = Router();

router.get('/', authenticateJWT, getCards);
router.post('/', createCardValidation, authenticateJWT, createCard);
router.delete('/:cardId', cardIdValidation, authenticateJWT, deleteCardById);
router.put('/:cardId/likes', cardIdValidation, authenticateJWT, likeCard);
router.delete('/:cardId/likes', cardIdValidation, authenticateJWT, dislikeCard);

export default router;
