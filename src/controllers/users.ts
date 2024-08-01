import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import NotFoundError from '../errors/not-found-error';
import BadRequestError from '../errors/bad-request-error';
import User from '../models/users';
import { constants } from 'http2';
import ConflictError from '../errors/conflict-error';

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    next(error);
  }
}

const createUser =  async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, about, avatar } = req.body;
    const newUser = await User.create({ name, about, avatar });
    return res.status(constants.HTTP_STATUS_CREATED).send(newUser);
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

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
  const { userId } = req.params;
  const user = await User.findById(userId).orFail(() => new NotFoundError('Пользователь не найден'));
  res.send(user);
  } catch (error) {
    if(error instanceof MongooseError.CastError) {
      return next(new BadRequestError('Не валидный id'));
    }
    return next(error);
  }
}

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = res.locals.user._id;
    const { name, about } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, about },
      { new: true, runValidators: true }
    )
    .orFail(() => new NotFoundError('Пользователь с указанным _id не найден'));
    return res.send(updatedUser);
  } catch (error) {
    if(error instanceof MongooseError.CastError) {
      return next(new BadRequestError('Не валидный _id'));
    }
    if(error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError('Переданы некорректные данные'))
    }
    return next(error);
  }

}

const updateUserAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = res.locals.user._id;
    const { avatar } = req.body;
    if(!avatar) return next(new BadRequestError('Переданы некорректные данные'));

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { avatar },
      {
        new: true,
        runValidators: true
      }
    )
    .orFail(() => new NotFoundError('Пользователь с указанным _id не найден'));
    return res.send(updatedUser);

  } catch (error) {
    if(error instanceof MongooseError.CastError) {
      return next(new BadRequestError('Не валидный _id'));
    }
    if(error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError('Переданы некорректные данные'))
    }
    return next(error);
  }

}

export { getUsers, createUser, getUserById, updateUser, updateUserAvatar };

