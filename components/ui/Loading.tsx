export default function PageLoader() {
  return (
    <div className="min-h-screen bg-bark flex flex-col items-center justify-center gap-4">
      <div className="flex gap-1.5">
        <span
          className="w-2 h-2 rounded-full bg-orange animate-pulse-dot"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="w-2 h-2 rounded-full bg-orange animate-pulse-dot"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="w-2 h-2 rounded-full bg-orange animate-pulse-dot"
          style={{ animationDelay: "300ms" }}
        />
      </div>
      <p className="text-[0.68rem] uppercase tracking-widest text-umber">
        Loading...
      </p>
    </div>
  );
}
