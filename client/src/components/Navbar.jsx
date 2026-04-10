export default function Navbar() {
  return (
    <header className=" top-0 z-50 border-b border-[#3b1502]/20 backdrop-blur-md bg-[#ecd5b8]/90">
      <div className="max-w-2xl mx-auto px-4 py-7 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Newzie logo" className="h-9 w-9 object-contain" />
          <span className="text-3xl font-bold tracking-tight text-[#3b1502]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            New<span className="opacity-50">zie</span>
          </span>
          <span className="text-[10px] font-semibold bg-[#3b1502] text-[#ecd5b8] px-2 py-0.5 rounded-full">
            LIVE
          </span>
        </div>
        <p className="text-sm text-[#3b1502]/50 hidden sm:block">Updated every 24h</p>
      </div>
    </header>
  );
}
