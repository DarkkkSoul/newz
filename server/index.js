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

// In local dev, start the server and run the scraper once
if (process.env.NODE_ENV !== 'production') {
  import('./lib/connectDB.js').then(({ default: connectDB }) => {
    connectDB().then(async () => {
      const { scrapeAllFeeds } = await import('./services/scraper.js');
      await scrapeAllFeeds();
      app.listen(process.env.PORT || 5000, () => {
        console.log(`[Server] Running on http://localhost:${process.env.PORT || 5000}`);
      });
    });
  });
}

export default app;
