export default function Footer() {
  return (
    <footer className="bg-ink px-6 py-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-brand flex items-center justify-center">
            <span className="font-mono font-bold text-[10px] text-white">
              DA
            </span>
          </div>
          <span className="font-syne font-bold text-base text-white">
            DoAm.ng
          </span>
        </div>

        <span className="font-mono text-[11px] text-white/25">
          © 2026 DoAm.ng. All rights reserved.
        </span>

        <span className="font-mono text-[11px] text-white/25">
          Built by <span className="text-brand">Falah Labs</span>
        </span>
      </div>
    </footer>
  );
}
