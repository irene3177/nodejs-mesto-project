import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import Card from '../models/cards';
import { constants } from 'http2';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import NotFoundError from '../errors/not-found-error';



const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const cards = await Card.find({});
    res.send(cards);
  } catch (error) {
    next(error);
  }
}

const createCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, link } = req.body;
    const id = res.locals.user._id;
    const newCard = await Card.create({ name, link, owner: id })
    res.status(constants.HTTP_STATUS_CREATED).send(newCard);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError(error.message));
    }
    if(error instanceof Error && error.message.startsWith("E11000")) {
      return next(new ConflictError('Имя уже используется'));
    }

    return next(error);
  }

}

const deleteCardById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    await Card.findByIdAndDelete(cardId).orFail(() => new NotFoundError('Карточка с указанным _id не найдена'));
    return res.status(constants.HTTP_STATUS_OK).send({ message: 'Карточка успешно удалена' });

  } catch (error) {
    if(error instanceof MongooseError.CastError) {
      return next(new BadRequestError('Не валидный id'));
    }
    return next(error);
  }

}

const likeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const likedCard = await Card
      .findByIdAndUpdate(
        cardId,
        { $addToSet: { likes: res.locals.user._id } },
        { new: true },
      )
      .orFail(() => new NotFoundError('Карточка с указанным _id не найдена'));
      return res.send(likedCard);
  } catch (error) {
    if(error instanceof MongooseError.CastError) {
      return next(new BadRequestError('Передан несуществующий _id карточки'));
    }
    return next(error);
  }
}

const dislikeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const dislikedCard = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: res.locals.user._id } },
      { new: true },
    )
    .orFail(() => new NotFoundError('Карточка с указанным _id не найдена'));
      return res.send(dislikedCard);
  } catch (error) {
    if(error instanceof MongooseError.CastError) {
      return next(new BadRequestError('Передан несуществующий _id карточки'));
    }
    return next(error);
  }


}

export { getCards, createCard, deleteCardById, likeCard, dislikeCard };