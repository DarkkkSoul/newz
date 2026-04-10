const FILTERS = [
  { label: 'Latest', value: 'latest' },
  { label: 'Trending', value: 'trending' },
  { label: 'AI', value: 'ai' },
  { label: 'OpenAI', value: 'openai' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'Java', value: 'java' },
  { label: 'Python', value: 'python' },
  { label: 'Security', value: 'security' },
  { label: 'Cloud', value: 'cloud' },
  { label: 'Mobile', value: 'mobile' },
  { label: 'Apple', value: 'apple' },
  { label: 'Google', value: 'google' },
  { label: 'Microsoft', value: 'microsoft' },
  { label: 'Startup', value: 'startup' },
];

export default function FilterBar({ active, onChange }) {
  return (
    <div className="top-[57px] z-40 bg-[#ecd5b8]/95 backdrop-blur-md border-b border-[#3b1502]/15">
      <div className="max-w-2xl mx-auto px-4 py-5">
        <div className="flex gap-2 overflow-x-auto scrollbar-theme pb-1">
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => onChange(f.value)}
              className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${
                active === f.value
                  ? 'bg-[#3b1502] border-[#3b1502] text-[#ecd5b8]'
                  : 'bg-transparent border-[#3b1502]/30 text-[#3b1502]/70 hover:bg-[#3b1502]/10 hover:text-[#3b1502] hover:border-[#3b1502]/60'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
