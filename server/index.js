import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import newsRouter from './routes/news.js';
import scrapeRouter from './routes/scrape.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/news', newsRouter);
app.use('/api/scrape', scrapeRouter);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// No app.listen() — Vercel handles this
export default app;
