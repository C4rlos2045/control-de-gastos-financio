import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { env } from './config/env.js';
import routes from './routes/indexRoutes.js';

import { notFoundMiddleware } from './middlewares/notFoundMiddleware.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';

const app = express();

app.use(helmet());

app.use(
    cors({
        origin: env.frontendUrl,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    })
);

app.use(express.json());

app.use('/api', routes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;