import { celebrate, Joi } from 'celebrate';

export const cardIdValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
  }),
});