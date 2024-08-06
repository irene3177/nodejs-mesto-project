import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import cors from 'cors';
import usersRoutes from './routes/users';
import cardsRoutes from './routes/cards';
import errorHandler from './middleware/errorHandler';
import notFoundHandler from './middleware/notFound';
import { createUser, login } from './controllers/users';
import { requestLogger, errorLogger } from './middleware/logger';
import { signupValidation, signinValidation } from './validators/userValidator';

const { PORT = '3000', MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.post('/signin', signinValidation, login);
app.post('/signup', signupValidation, createUser);
app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);

app.use(notFoundHandler);

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
};

connect();
