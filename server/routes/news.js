import express from 'express';
import Article from '../models/Article.js';
import connectDB from '../lib/connectDB.js';

const router = express.Router();

// GET /api/news?filter=latest|trending|javascript|...&page=1&limit=60
router.get('/', async (req, res) => {
  await connectDB();
  try {
    const { filter = 'latest', page = 1, limit = 60 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = {};
    let sort = { publishedAt: -1 };

    const tagFilters = [
      'javascript', 'java', 'python', 'openai', 'ai',
      'security', 'cloud', 'mobile', 'apple', 'google', 'microsoft', 'startup'
    ];

    if (filter === 'latest') {
      sort = { publishedAt: -1 };
    } else if (filter === 'trending') {
      const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
      query = { createdAt: { $gte: twelveHoursAgo } };
      sort = { createdAt: -1 };
    } else if (tagFilters.includes(filter)) {
      query = { tags: filter };
      sort = { publishedAt: -1 };
    }

    const [articles, total] = await Promise.all([
      Article.find(query).sort(sort).skip(skip).limit(parseInt(limit)).lean(),
      Article.countDocuments(query)
    ]);

    res.json({ articles, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// GET /api/news/sources
router.get('/sources', async (req, res) => {
  await connectDB();
  try {
    const sources = await Article.distinct('source');
    res.json(sources);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sources' });
  }
});

export default router;
