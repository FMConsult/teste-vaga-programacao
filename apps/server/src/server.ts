import 'reflect-metadata';
import cors from 'cors';
import 'express-async-errors';
import './container';

import express, { NextFunction, Request, Response } from 'express';

import { ErrorApp } from './ErrorApp';
import { router } from './routes';

const app = express();
app.use(express.json());
app.use(cors());
app.use(router);

app.use((error: Error, request: Request, response: Response, next: NextFunction) => {
  if (error instanceof ErrorApp) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  }

  return response.status(500).json({
    status: 'error',
    message: 'internal error',
  });
});

app.listen(4000, () => {
  console.log('server is runnning at 4000 Port');
});
