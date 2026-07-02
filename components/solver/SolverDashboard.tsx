type Claim = {
  id: string;
  plan: string;
  timeline: string;
  status: string;
  claimed_at: string;
  completed_at: string | null;
  abandoned_at: string | null;
  last_activity_at: string | null;
  problems: {
    id: string;
    heading: string;
    status: string;
  } | null;
};

type Profile = {
  is_solver: boolean;
  solver_bio: string | null;
  solver_skills: string[] | null;
  solver_available: boolean | null;
  full_name: string | null;
};

export default function SolverDashboard({
  profile,
  claims,
}: {
  profile: Profile;
  claims: Claim[];
}) {
  const activeClaims = claims.filter((c) => c.status === "active");

  return (
    <div className="flex flex-col gap-8">
      <div className="border-b border-border pb-8">
        <p className="text-[0.7rem] uppercase tracking-widest text-umber mb-1">
          Solver dashboard
        </p>
        <h1 className="font-playfair text-3xl md:text-4xl text-parch">
          Welcome back{profile.full_name ? `, ${profile.full_name}` : ""}
        </h1>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-[0.7rem] uppercase tracking-widest text-umber">
          Your active claims
        </h2>

        {activeClaims.length === 0 && (
          <p className="text-[0.85rem] text-parch/70">
            You don&apos;t have any active claims right now — browse open
            problems to pick one up.
          </p>
        )}

        <div className="flex flex-col gap-3">
          {activeClaims.map((claim) => (
            <div
              key={claim.id}
              className="flex flex-col gap-1 border border-border bg-surface px-5 py-4"
            >
              <p className="text-[0.95rem] text-parch">
                {claim.problems?.heading ?? "Untitled problem"}
              </p>
              <p className="text-[0.7rem] uppercase tracking-widest text-umber">
                Claimed {new Date(claim.claimed_at).toLocaleDateString()}
                {claim.timeline ? ` · Timeline: ${claim.timeline}` : ""}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
