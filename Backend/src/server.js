import express from 'express';
import cors from 'cors';
import authRouter from './routes/authRouter.js';
import inventoryRouter from './routes/inventoryRouter.js'
import './config/conectionCore.js';
import { corsConfig } from './config/cors.js';

const app = express();

app.use(express.json());

app.use(cors(corsConfig))

app.use('/auth', authRouter)
app.use('/inventory', inventoryRouter)

export default app;