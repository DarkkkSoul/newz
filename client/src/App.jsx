import { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import FilterBar from './components/FilterBar';
import NewsCard from './components/NewsCard';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export default function App() {
  const [articles, setArticles] = useState([]);
  const [filter, setFilter] = useState('latest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  const fetchNews = useCallback(async (activeFilter) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/news?filter=${activeFilter}&limit=60`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setArticles(data.articles);
      setTotal(data.total);
    } catch (err) {
      setError('Could not load news. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews(filter);
  }, [filter, fetchNews]);

  function handleFilterChange(newFilter) {
    setFilter(newFilter);
    setArticles([]);
  }

  return (
    <div className="min-h-screen bg-[#ecd5b8]">
      <Navbar />
      <FilterBar active={filter} onChange={handleFilterChange} />

      <main className="max-w-2xl mx-auto border border-t-0 border-[#3b1502]/10">
        {/* Stats bar */}
        {!loading && !error && (
          <div className="px-4 py-3 flex items-center justify-between">
            <p className="text-xs text-[#3b1502]/40">
              {total} article{total !== 1 ? 's' : ''}
            </p>
            <button
              onClick={() => fetchNews(filter)}
              className="text-xs text-[#3b1502]/40 hover:text-[#3b1502] transition-colors cursor-pointer"
            >
              ↻ Refresh
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="divide-y divide-[#3b1502]/10">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="px-4 py-4 animate-pulse">
                <div className="h-4 bg-[#3b1502]/10 rounded w-full mb-2" />
                <div className="h-4 bg-[#3b1502]/10 rounded w-3/4 mb-3" />
                <div className="flex gap-2">
                  <div className="h-3 bg-[#3b1502]/10 rounded w-20" />
                  <div className="h-3 bg-[#3b1502]/10 rounded w-12" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="px-4 py-16 text-center">
            <p className="text-[#3b1502]/50 text-sm">{error}</p>
            <button
              onClick={() => fetchNews(filter)}
              className="mt-4 text-xs text-[#3b1502] underline hover:opacity-70 transition-opacity cursor-pointer"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && articles.length === 0 && (
          <div className="px-4 py-16 text-center">
            <p className="text-[#3b1502]/50 text-sm">No articles found for this filter.</p>
          </div>
        )}

        {/* News list */}
        {!loading && !error && articles.length > 0 && (
          <div className="">
            {articles.map(article => (
              <NewsCard key={article._id} article={article} />
            ))}
          </div>
        )}

        <div className="h-16" />
      </main>
    </div>
  );
}
