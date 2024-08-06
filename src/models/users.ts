import { model, Schema } from 'mongoose';
import validator from 'validator';
import { URL_REGEX } from '../constants';

export interface IUser {
  name: string;
  email: string;
  password: string;
  about: string;
  avatar: string;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      default: 'Жак-Ив Кусто',
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v: string) => validator.isEmail(v),
        message: 'Неправильный формат почты',
      },
    },
    password: {
      type: String,
      required: [true, 'Поле password не может быть пустым'],
      select: false,
    },
    about: {
      type: String,
      maxlength: 200,
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      match: [URL_REGEX, 'Неверный формат ссылки на аватарку'],
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
  },
  {
    versionKey: false,
  },
);

export default model<IUser>('user', userSchema);
