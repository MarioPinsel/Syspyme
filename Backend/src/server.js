import express from 'express';
import cors from 'cors';
import router from './routes/router.js';
import './config/db.js';
import { corsConfig } from './config/cors.js';

const app = express();

app.use(cors(corsConfig))

app.use(express.json());

app.use('/', router)

export default app;