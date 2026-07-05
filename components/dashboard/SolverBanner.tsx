import Link from "next/link";

export default function SolverBanner() {
  return (
    <div className="mt-8 border border-orange/30 bg-orange px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <p className="text-[1rem] uppercase tracking-widest text-parch mb-1">
          Want to do more?
        </p>
        <p className="text-parch text-sm">
          Register as a solver to start solving problems and report solutions.
        </p>
      </div>
      <Link
        href="/dashboard/solver"
        className="text-[0.7rem] uppercase font-medium tracking-widest bg-parch text-orange px-5 py-2.5 hover:opacity-90 transition-colors whitespace-nowrap self-start md:self-auto"
      >
        Become a solver
      </Link>
    </div>
  );
}
