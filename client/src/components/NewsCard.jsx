import { useState, useEffect } from 'react';

function timeAgo(dateStr) {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function NewsCard({ article }) {
  const [visited, setVisited] = useState(false);

  useEffect(() => {
    const visitedUrls = JSON.parse(localStorage.getItem('visitedUrls') || '[]');
    if (visitedUrls.includes(article.url)) setVisited(true);
  }, [article.url]);

  function handleClick() {
    const visitedUrls = JSON.parse(localStorage.getItem('visitedUrls') || '[]');
    if (!visitedUrls.includes(article.url)) {
      visitedUrls.push(article.url);
      localStorage.setItem('visitedUrls', JSON.stringify(visitedUrls));
    }
    setVisited(true);
  }

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`group block px-4 py-4 border-b border-[#3b1502]/10 transition-all duration-150 hover:bg-[#3b1502]/5 ${
        visited ? 'opacity-40' : 'opacity-100'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium leading-snug transition-colors duration-150 group-hover:text-[#3b1502] ${
            visited ? 'text-[#3b1502]/40' : 'text-[#3b1502]'
          }`}>
            {article.title}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[11px] font-semibold text-black">
              {article.source}
            </span>
            <span className="text-[11px] text-black/30">·</span>
            <span className="text-[11px] text-black/50">
              {timeAgo(article.publishedAt)}
            </span>
            {visited && (
              <>
                <span className="text-[11px] text-black/30">·</span>
                <span className="text-[11px] text-black/30">visited</span>
              </>
            )}
          </div>
        </div>
        <svg
          className="shrink-0 w-3.5 h-3.5 text-[#3b1502]/30 group-hover:text-[#3b1502] transition-colors mt-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </div>
    </a>
  );
}
