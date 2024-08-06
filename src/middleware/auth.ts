import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import UnauthorizedError from '../errors/unauthorizedError';
import { JWT_SECRET } from '../constants';

export interface SessionRequest extends Request {
  user?: JwtPayload;
}

const authenticateJWT = (req: SessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  let payload: JwtPayload | undefined;

  if (!authorization ||!authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');

  const secret = JWT_SECRET;
  try {
    payload = jwt.verify(token, secret || 'secret-key') as JwtPayload;


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload;

  next();
};

export default authenticateJWT;