import "dotenv/config";
import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { join } from 'path';
import { errors, celebrate, Joi } from 'celebrate';
import cors from 'cors';
import usersRoutes from './routes/users';
import cardsRoutes from './routes/cards';
import errorHandler from './middleware/error-handler';
import { createUser, login } from './controllers/users';
import { requestLogger, errorLogger } from './middleware/logger';
import { urlRegex } from './models/users';



const { PORT = "3000", MONGO_URL = "mongodb://localhost:27017/mestodb" } = process.env;

const app = express();


app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS' ],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(join(__dirname, "public")));

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}),login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().max(30),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    about: Joi.string().max(200),
    avatar: Joi.string().regex(urlRegex),
  }),
}), createUser);
app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

const connect = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('Connected to MongoDB');

    await app.listen(PORT);
    console.log(`App is listening on port ${PORT}`);
  } catch (error) {
    console.log(error);
  }
}

connect();