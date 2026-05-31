const categories = [
  { icon: "🛣️", name: "Infrastructure", count: 187 },
  { icon: "🏥", name: "Health", count: 134 },
  { icon: "📚", name: "Education", count: 98 },
  { icon: "💧", name: "Water & Sanitation", count: 76 },
  { icon: "🔒", name: "Security", count: 65 },
  { icon: "🌿", name: "Environment", count: 58 },
  { icon: "⚡", name: "Power & Energy", count: 112 },
  { icon: "💼", name: "Employment", count: 89 },
];

export default function Categories() {
  return (
    <section id="categories" className="bg-ink border-b-2 border-ink">
      <div className="max-w-6xl mx-auto px-6">
        <div className="py-12 border-b-2 border-white/10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <h2 className="font-syne font-extrabold text-5xl md:text-6xl tracking-tight text-white uppercase leading-none">
            What will
            <br />
            you solve?
          </h2>
          <p className="font-mono text-[12px] text-white/40 max-w-xs leading-relaxed">
            Pick a category and find the problems that match your skills, your
            location, your passion.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 divide-x-0 border-b-2 border-white/10">
          {categories.map((cat, i) => (
            <button
              key={cat.name}
              className={`group p-6 text-left border-b-2 border-white/10 hover:bg-brand transition-colors duration-150 ${
                i % 4 !== 3 ? "md:border-r-2" : ""
              } ${i % 2 !== 1 ? "border-r-2" : ""}`}
            >
              <span className="text-2xl block mb-4">{cat.icon}</span>
              <span className="font-syne font-bold text-[14px] text-white block mb-1 group-hover:text-white">
                {cat.name}
              </span>
              <span className="font-mono text-[11px] text-white/40 group-hover:text-white/70">
                {cat.count} problems
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
