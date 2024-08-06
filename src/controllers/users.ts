import { Request, Response, NextFunction } from 'express';
import { Model, Error as MongooseError } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { constants } from 'http2';
import User, { IUser } from '../models/users';
import BadRequestError from '../errors/badRequestError';
import NotFoundError from '../errors/notFoundError';
import ConflictError from '../errors/conflictError';
import UnauthorizedError from '../errors/unauthorizedError';
import { SessionRequest } from '../middleware/auth';
import { ERRORS, JWT_SECRET } from '../constants';


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
    const { name, email, password, about, avatar } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({ name, email, password: hashedPassword, about, avatar });
    return res.status(constants.HTTP_STATUS_CREATED).send(newUser);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError(error.message));
    }
    if(error instanceof Error && error.message.startsWith(ERRORS.DUPLICATE)) {
      return next(new ConflictError('Пользователь с таким email уже существует.'));
    }
    return next(error);
  }
}

const getUserById = async (req: Request, res: Response, next: NextFunction) => {

  const { userId } = req.params;
  await findUserById(userId, res, next);
}

const getUserByToken= async (req: SessionRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    await findUserById(userId, res, next);
}

const updateUser = async (req: SessionRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.userId;
  const updateData = {
    name: req.body.name,
    about: req.body.about,
  };
  await updateById(User, userId, updateData, res, next);
}

const updateUserAvatar = async (req: SessionRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.userId;
  const updateData = {
    avatar: req.body.avatar
  };
  await updateById(User, userId, updateData, res, next);
}


const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password').orFail(() => new UnauthorizedError('Неверный логин или пароль'));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new UnauthorizedError('Неверный логин или пароль'));
    }
    const payload = { userId: user._id };
    const secret = JWT_SECRET;

    const token = jwt.sign(payload, secret, { expiresIn: '7d' });
    return res.json({ token });

  } catch (error) {
    return next(error);
  }
}

const findUserById = async (userId: string, res: Response, next: NextFunction) => {
  try {

    const user = await User.findById(userId).orFail(() => new NotFoundError('Пользователь не найден'));
    res.send(user);
  } catch (error) {
    if(error instanceof MongooseError.CastError) {
      return next(new BadRequestError('Не валидный id'));
    }
    return next(error);
  }
}

const updateById = async(Model: Model<IUser>, userId: string, updateData: Partial<IUser>, res: Response, next: NextFunction) => {
  try {
    const user = await Model.findByIdAndUpdate(
      userId,
      updateData,
      {
        new: true,
        runValidators: true
      })
      .orFail(() => new NotFoundError('Пользователь с указанным _id не найден'));
    return res.send(user);
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

export { getUsers, createUser, getUserById, getUserByToken, updateUser, updateUserAvatar, login };

