import express from 'express';
import connectDB from '../lib/connectDB.js';
import { scrapeAllFeeds } from '../services/scraper.js';

const router = express.Router();

// POST /api/scrape
// Called by Vercel Cron every 24h (configured in vercel.json)
// Protected by a secret token to prevent public abuse
router.post('/', async (req, res) => {
  const token = req.headers['x-cron-secret'];
  if (token !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await connectDB();
  try {
    await scrapeAllFeeds();
    res.json({ success: true, message: 'Scrape completed' });
  } catch (err) {
    console.error('[Scrape route]', err);
    res.status(500).json({ error: 'Scrape failed' });
  }
});

export default router;
