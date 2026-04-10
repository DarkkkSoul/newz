import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true, unique: true },
  source: { type: String, required: true },
  publishedAt: { type: Date, default: Date.now },
  tags: [String],
  createdAt: { type: Date, default: Date.now } // TTL managed by index below
});

articleSchema.index({ createdAt: 1 }, { expireAfterSeconds: 172800 }); // 48h TTL

export default mongoose.model('Article', articleSchema);
