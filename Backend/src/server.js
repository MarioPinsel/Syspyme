import express from 'express';
import router from './routes/router.js';
import './config/db.js';

const app = express();

app.use(express.json());

app.use('/', router)

export default app;