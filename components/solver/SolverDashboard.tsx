import Link from "next/link";

type Claim = {
  id: string;
  plan: string;
  timeline: string;
  status: string;
  claimed_at: string;
  completed_at: string | null;
  abandoned_at: string | null;
  abandon_reason: string | null;
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
  full_name: string | null;
};

function ClaimRow({
  claim,
  tone,
}: {
  claim: Claim;
  tone: "amber" | "orange" | "default" | "muted";
}) {
  const borderTone =
    tone === "amber"
      ? "border-amber-500/30 hover:border-amber-500/60"
      : tone === "orange"
        ? "border-border hover:border-orange/40"
        : tone === "muted"
          ? "border-border opacity-60"
          : "border-border";

  return (
    <Link
      href={`/dashboard/solver/claims/${claim.id}`}
      className={`flex flex-col gap-1 border bg-surface px-5 py-4 transition-colors ${borderTone}`}
    >
      <p className="text-[0.95rem] text-parch">
        {claim.problems?.heading ?? "Problem no longer available"}
      </p>
      {claim.status === "pending_approval" && (
        <p className="text-[0.7rem] uppercase tracking-widest text-amber-500">
          Requested {new Date(claim.claimed_at).toLocaleDateString()}
        </p>
      )}
      {claim.status === "active" && (
        <p className="text-[0.7rem] uppercase tracking-widest text-umber">
          Claimed {new Date(claim.claimed_at).toLocaleDateString()}
          {claim.timeline ? ` · Target: ${claim.timeline}` : ""}
        </p>
      )}
      {claim.status === "completed" && (
        <p className="text-[0.7rem] uppercase tracking-widest text-umber">
          Completed{" "}
          {claim.completed_at
            ? new Date(claim.completed_at).toLocaleDateString()
            : ""}
        </p>
      )}
      {claim.status === "abandoned" && (
        <>
          <p className="text-[0.7rem] uppercase tracking-widest text-umber">
            Abandoned{" "}
            {claim.abandoned_at
              ? new Date(claim.abandoned_at).toLocaleDateString()
              : ""}
          </p>
          {claim.abandon_reason && (
            <p className="text-[0.75rem] text-parch/50 italic mt-0.5 line-clamp-1">
              &quot;{claim.abandon_reason}&quot;
            </p>
          )}
        </>
      )}
    </Link>
  );
}

export default function SolverDashboard({
  profile,
  claims,
}: {
  profile: Profile;
  claims: Claim[];
}) {
  const pendingClaims = claims.filter((c) => c.status === "pending_approval");
  const activeClaims = claims.filter((c) => c.status === "active");
  const completedClaims = claims.filter((c) => c.status === "completed");
  const abandonedClaims = claims.filter((c) => c.status === "abandoned");
  const rejectedClaims = claims.filter((c) => c.status === "rejected");
  const withdrawnClaims = claims.filter((c) => c.status === "withdrawn");
  const stats = [
    { label: "Pending approval", value: pendingClaims.length },
    { label: "Active claims", value: activeClaims.length },
    { label: "Completed", value: completedClaims.length },
    { label: "Total claims", value: claims.length },
  ];

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

      <div className="flex flex-wrap border border-border">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`flex-1 min-w-[45%] md:min-w-0 px-6 py-6 ${
              i !== stats.length - 1 ? "border-r border-border" : ""
            }`}
          >
            <div className="font-playfair text-4xl text-orange mb-1">
              {s.value}
            </div>
            <div className="text-[0.68rem] uppercase tracking-widest text-umber">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {profile.solver_skills && profile.solver_skills.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-[0.7rem] uppercase tracking-widest text-umber">
            Your skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {profile.solver_skills.map((skill) => (
              <span
                key={skill}
                className="text-[0.7rem] uppercase tracking-wide px-3 py-1.5 bg-surface border border-border text-parch/70"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {pendingClaims.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-[0.7rem] uppercase tracking-widest text-umber">
            Awaiting admin approval
          </h2>
          <div className="flex flex-col gap-3">
            {pendingClaims.map((c) => (
              <ClaimRow key={c.id} claim={c} tone="amber" />
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <h2 className="text-[0.7rem] uppercase tracking-widest text-umber">
          Your active claims
        </h2>
        {activeClaims.length === 0 ? (
          <p className="text-[0.85rem] text-parch/70">
            No active claims yet.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {activeClaims.map((c) => (
              <ClaimRow key={c.id} claim={c} tone="orange" />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-[0.7rem] uppercase tracking-widest text-umber">
          Completed
        </h2>
        {completedClaims.length === 0 ? (
          <p className="text-[0.85rem] text-parch/70">
            No completed problems yet.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {completedClaims.map((c) => (
              <ClaimRow key={c.id} claim={c} tone="default" />
            ))}
          </div>
        )}
      </div>

      {abandonedClaims.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-[0.7rem] uppercase tracking-widest text-umber">
            Abandoned
          </h2>
          <div className="flex flex-col gap-3">
            {abandonedClaims.map((c) => (
              <ClaimRow key={c.id} claim={c} tone="muted" />
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <h2 className="text-[0.7rem] uppercase tracking-widest text-umber">
          Rejected
        </h2>
        {rejectedClaims.length === 0 ? (
          <p className="text-[0.85rem] text-parch/70">
            No rejected problems yet.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {rejectedClaims.map((c) => (
              <ClaimRow key={c.id} claim={c} tone="default" />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-[0.7rem] uppercase tracking-widest text-umber">
          Withdrawn
        </h2>
        {withdrawnClaims.length === 0 ? (
          <p className="text-[0.85rem] text-parch/70">
            No withdrawn problems yet.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {withdrawnClaims.map((c) => (
              <ClaimRow key={c.id} claim={c} tone="default" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
