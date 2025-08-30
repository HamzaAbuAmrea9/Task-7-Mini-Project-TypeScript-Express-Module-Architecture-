import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './auth/auth.routes';
import userRouter from './users/user.routes';
import courseRouter from './courses/course.routes';
import { errorHandler } from './shared/middlewares/error-handler.middleware'; 
import { notFoundHandler } from './shared/middlewares/not-found.middleware'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


app.get('/', (req: Request, res: Response) => {
  res.send('API is running...');
});

// === API Routes ===
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/courses', courseRouter);

// === Not Found Middleware ===

app.use(notFoundHandler); 

// === Global Error Handler ===

app.use(errorHandler); // <-- USE Error Handler

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});