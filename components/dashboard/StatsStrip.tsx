type Props = {
  reported: number;
  solved: number;
  followed: number;
};

export default function StatsStrip({ reported, solved, followed }: Props) {
  const stats = [
    { label: "Problems reported", value: reported },
    { label: "Problems followed", value: followed },
    { label: "Problems solved", value: solved },
  ];

  return (
    <div className="grid grid-cols-3 border border-border">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className={`px-6 py-6 ${i !== 2 ? "border-r border-border" : ""}`}
        >
          <div className="font-playfair text-3xl text-orange mb-1">
            {s.value}
          </div>
          <div className="text-[0.68rem] uppercase tracking-widest text-umber">
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}
