import { celebrate, Joi } from 'celebrate';
import { urlRegex } from '../models/users';

export const signupValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().max(30),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    about: Joi.string().max(200),
    avatar: Joi.string().regex(urlRegex),
  }),
});

export const signinValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

export const updateUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().max(30),
    about: Joi.string().max(200),
  }),
});

export const updateUserAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(urlRegex),
  }),
});

export const userIdValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
});
