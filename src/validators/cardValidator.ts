import { celebrate, Joi } from 'celebrate';
import { urlRegex } from '../models/users';

export const cardIdValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
});

export const createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().regex(urlRegex),
  }),
});
