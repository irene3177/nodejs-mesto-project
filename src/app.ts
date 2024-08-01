import "dotenv/config";
import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import usersRoutes from './routes/users';
import cardsRoutes from './routes/cards';
import errorHandler from './middleware/error-handler';
import { AuthContext } from './types/auth-context';
import { join } from 'path';



const { PORT = "3000", MONGO_URL = "mongodb://localhost:27017/mestodb" } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(join(__dirname, "public")));

app.use((req: Request, res: Response<unknown, AuthContext>, next: NextFunction) => {
  res.locals.user = {
    _id: '66ab89983d08eed8c4e2be75'
  };
  next();
});

app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);


app.use(errorHandler);

const connect = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.log(error);
  }

  await app.listen(PORT);
  console.log(`App is listening on port ${PORT}`);


}

connect();