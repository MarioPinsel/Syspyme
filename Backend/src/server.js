import express from 'express';
import router from './routes/router.js';
import './config/conectionCore.js';

const app = express();

app.use(express.json());

app.use('/', router)

export default app;