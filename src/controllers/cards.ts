import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError, Model } from 'mongoose';
import Card, { ICard } from '../models/cards';
import { constants } from 'http2';
import BadRequestError from '../errors/badRequestError';
import NotFoundError from '../errors/notFoundError';
import ForbiddenError from '../errors/forbiddenError';
import { SessionRequest } from '../middleware/auth';


const updateCardLikes = async(
  Model: Model<ICard>,
  operation: 'like'| 'dislike',
  req: SessionRequest,
  res: Response,
  next: NextFunction
) => {
  try {

    const userId = req.user?.userId;
    const { cardId } = req.params;
    const updateOperation = operation === 'like' ?
    { $addToSet: { likes: userId } } :
    { $pull: { likes: userId } };
    const card = await Model.findByIdAndUpdate(
      cardId,
      updateOperation,
      { new: true }
    )
    .orFail(() => new NotFoundError('Карточка с указанным _id не найдена'));
    return res.send(card);
  } catch (error) {
    if(error instanceof MongooseError.CastError) {
      return next(new BadRequestError('Передан несуществующий _id карточки'));
    }
    return next(error);
  }
}


const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const cards = await Card.find({});
    res.send(cards);
  } catch (error) {
    next(error);
  }
}

const createCard = async (req: SessionRequest, res: Response, next: NextFunction) => {
  try {
    const { name, link } = req.body;
    const id = req.user?.userId;
    const newCard = await Card.create({ name, link, owner: id })
    res.status(constants.HTTP_STATUS_CREATED).send(newCard);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError(error.message));
    }
    return next(error);
  }

}

const deleteCardById = async (req: SessionRequest, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId).orFail(() => new NotFoundError('Карточка с указанным _id не найдена'));

    if (card.owner.toString()!== req.user?.userId.toString()) {
      return next(new ForbiddenError('Нет прав на удаление карточки'));
    }

    await Card.findByIdAndDelete(cardId);
    return res.status(constants.HTTP_STATUS_OK).send({ message: 'Карточка успешно удалена' });

  } catch (error) {
    if(error instanceof MongooseError.CastError) {
      return next(new BadRequestError('Не валидный id'));
    }
    return next(error);
  }
}

const likeCard = async (req: SessionRequest, res: Response, next: NextFunction) => {
  await updateCardLikes(Card, 'like', req, res, next);
}

const dislikeCard = async (req: SessionRequest, res: Response, next: NextFunction) => {
  await updateCardLikes(Card, 'dislike', req, res, next);
}

export { getCards, createCard, deleteCardById, likeCard, dislikeCard };