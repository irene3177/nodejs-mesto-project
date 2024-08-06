export const ERRORS = {
  DUPLICATE: 'E11000',
};

export const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

export const URL_REGEX: RegExp = /^(https?:\/\/)(www\.)?[\w\-._~:/?#[\]@!$&'()*+,;=]+(\.[a-z]{2,})(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?(#\w*)?$/i;
