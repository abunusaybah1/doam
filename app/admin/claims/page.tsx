import { createClient } from "@/lib/supabase/server";
import ClaimApprovalRow from "@/components/admin/ClaimApprovalRow";
import OverdueClaimRow from "@/components/admin/OverdueClaimRow";
import { isTimelineOverdue } from "@/lib/claims/timeline";

export default async function AdminClaimsPage() {
  const supabase = await createClient();

  const { data: rawPending } = await supabase
    .from("claims")
    .select(
      `
      id, plan, timeline, claimed_at, solver_id,
      problems ( id, heading ),
      user_profiles ( full_name, username )
    `,
    )
    .eq("status", "pending_approval")
    .order("claimed_at", { ascending: true });

  const { data: rawActive } = await supabase
    .from("claims")
    .select(
      `
      id, plan, timeline, claimed_at, solver_id,
      problems ( id, heading ),
      user_profiles ( full_name, username )
    `,
    )
    .eq("status", "active");

  const normalize = (rows: typeof rawPending) =>
    (rows ?? []).map((c) => ({
      ...c,
      problems: Array.isArray(c.problems)
        ? (c.problems[0] ?? null)
        : c.problems,
      user_profiles: Array.isArray(c.user_profiles)
        ? (c.user_profiles[0] ?? null)
        : c.user_profiles,
    }));

  const pendingClaims = normalize(rawPending);
  const overdueClaims = normalize(rawActive).filter((c) =>
    isTimelineOverdue(c.timeline),
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-6">
        <h1 className="font-playfair text-3xl text-parch">Claim approvals</h1>
        {!pendingClaims.length ? (
          <p className="text-[0.85rem] text-parch/60">
            No claims awaiting approval.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {pendingClaims.map((c) => (
              <ClaimApprovalRow key={c.id} claim={c} />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6 border-t border-border pt-8">
        <h2 className="font-playfair text-2xl text-parch">
          Overdue — past target date
        </h2>
        {!overdueClaims.length ? (
          <p className="text-[0.85rem] text-parch/60">
            No overdue claims right now.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {overdueClaims.map((c) => (
              <OverdueClaimRow key={c.id} claim={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
