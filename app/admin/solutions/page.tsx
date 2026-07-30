import { createClient } from "@/lib/supabase/server";
import SolutionReviewRow from "@/components/admin/SolutionReviewRow";

export default async function AdminSolutionsPage() {
  const supabase = await createClient();

  const { data: rawReports } = await supabase
    .from("solution_reports")
    .select(
      `
      id, summary, evidence_urls, video_url, cost, people_helped, created_at,
      problems ( id, heading ),
      user_profiles ( full_name, username )
    `,
    )
    .eq("status", "pending_review")
    .order("created_at", { ascending: true });

  const reports = (rawReports ?? []).map((r) => ({
    ...r,
    problems: Array.isArray(r.problems) ? (r.problems[0] ?? null) : r.problems,
    user_profiles: Array.isArray(r.user_profiles)
      ? (r.user_profiles[0] ?? null)
      : r.user_profiles,
  }));

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-playfair text-3xl text-parch">Solution reviews</h1>
      {!reports.length ? (
        <p className="text-[0.85rem] text-parch/60">
          No solutions awaiting review.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {reports.map((r) => (
            <SolutionReviewRow key={r.id} report={r} />
          ))}
        </div>
      )}
    </div>
  );
}
