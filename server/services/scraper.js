import Parser from 'rss-parser';
import Article from '../models/Article.js';

const parser = new Parser({
  customFields: {
    item: ['media:content', 'media:thumbnail', 'enclosure']
  }
});

const RSS_FEEDS = [
  { url: 'https://techcrunch.com/feed/', source: 'TechCrunch' },
  { url: 'https://www.theverge.com/rss/index.xml', source: 'The Verge' },
  { url: 'https://www.wired.com/feed/rss', source: 'Wired' },
  { url: 'https://feeds.arstechnica.com/arstechnica/index', source: 'Ars Technica' },
  { url: 'https://www.engadget.com/rss.xml', source: 'Engadget' },
  { url: 'https://gizmodo.com/feed', source: 'Gizmodo' },
  { url: 'https://www.technologyreview.com/feed/', source: 'MIT Technology Review' },
  { url: 'https://www.zdnet.com/news/rss.xml', source: 'ZDNet' },
  { url: 'https://hnrss.org/frontpage', source: 'Hacker News' },
  { url: 'https://www.smashingmagazine.com/feed/', source: 'Smashing Magazine' }
];

const TECH_KEYWORDS = [
  'tech', 'software', 'hardware', 'ai', 'artificial intelligence', 'machine learning',
  'javascript', 'python', 'java', 'typescript', 'react', 'node', 'cloud', 'aws',
  'google', 'apple', 'microsoft', 'meta', 'openai', 'chatgpt', 'gpt', 'llm',
  'startup', 'app', 'mobile', 'android', 'ios', 'web', 'api', 'database',
  'security', 'cyber', 'hack', 'privacy', 'data', 'blockchain', 'crypto',
  'electric', 'robot', 'space', 'science', 'programming', 'developer', 'code',
  'open source', 'linux', 'windows', 'macos', 'chip', 'gpu', 'cpu', 'nvidia',
  'samsung', 'tesla', 'elon', 'internet', 'browser', 'firefox', 'chrome'
];

const TAG_MAP = {
  javascript: ['javascript', 'js', 'node', 'react', 'vue', 'angular', 'typescript'],
  java: ['java', 'spring', 'jvm', 'kotlin'],
  python: ['python', 'django', 'flask', 'pytorch', 'tensorflow'],
  openai: ['openai', 'chatgpt', 'gpt', 'dall-e', 'whisper', 'sora'],
  ai: ['ai', 'artificial intelligence', 'machine learning', 'deep learning', 'llm', 'neural'],
  security: ['security', 'cyber', 'hack', 'breach', 'vulnerability', 'malware', 'ransomware'],
  cloud: ['cloud', 'aws', 'azure', 'gcp', 'kubernetes', 'docker', 'devops'],
  mobile: ['android', 'ios', 'iphone', 'mobile', 'app store', 'google play'],
  apple: ['apple', 'iphone', 'ipad', 'mac', 'macos', 'wwdc'],
  google: ['google', 'alphabet', 'chrome', 'android', 'gemini'],
  microsoft: ['microsoft', 'windows', 'azure', 'copilot', 'bing'],
  startup: ['startup', 'funding', 'venture', 'series a', 'series b', 'ipo', 'acquisition']
};

function extractTags(text) {
  const lower = text.toLowerCase();
  const tags = new Set();
  for (const [tag, keywords] of Object.entries(TAG_MAP)) {
    if (keywords.some(kw => lower.includes(kw))) {
      tags.add(tag);
    }
  }
  return Array.from(tags);
}

function isTechRelated(title) {
  const lower = title.toLowerCase();
  return TECH_KEYWORDS.some(kw => lower.includes(kw));
}

export async function scrapeAllFeeds() {
  console.log('[Scraper] Starting feed scrape...');
  let saved = 0;
  let skipped = 0;

  for (const feed of RSS_FEEDS) {
    try {
      const result = await parser.parseURL(feed.url);
      for (const item of result.items) {
        const title = item.title?.trim();
        const url = item.link?.trim();
        if (!title || !url) continue;

        // For general tech sites, all articles are tech-related
        // For Hacker News, filter by keywords
        if (feed.source === 'Hacker News' && !isTechRelated(title)) continue;

        const tags = extractTags(title + ' ' + (item.contentSnippet || ''));
        const publishedAt = item.pubDate ? new Date(item.pubDate) : new Date();

        try {
          await Article.findOneAndUpdate(
            { url },
            { title, url, source: feed.source, publishedAt, tags },
            { upsert: true, new: true }
          );
          saved++;
        } catch (err) {
          if (err.code !== 11000) console.error(`[Scraper] DB error for ${url}:`, err.message);
          else skipped++;
        }
      }
      console.log(`[Scraper] ✓ ${feed.source}`);
    } catch (err) {
      console.error(`[Scraper] ✗ ${feed.source}:`, err.message);
    }
  }

  console.log(`[Scraper] Done. Saved: ${saved}, Skipped (duplicates): ${skipped}`);
}
