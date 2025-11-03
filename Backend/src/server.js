import express from 'express';
import authRouter from './routes/authRouter.js';
import inventoryRouter from './routes/inventoryRouter.js'
import './config/db.js';

const app = express();

app.use(express.json());

app.use('/auth', authRouter)
app.use('/inventory', inventoryRouter)

export default app;