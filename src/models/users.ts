import { model, Schema } from 'mongoose';

export interface IUser {
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Поле name не может быть пустым'],
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    required: [true, 'Поле about не может быть пустым'],
  },
  avatar: {
    type: String,
    required: [true, 'Поле avatar не может быть пустым'],
  }
},
{
  versionKey: false,
});


export default model<IUser>('user', userSchema);