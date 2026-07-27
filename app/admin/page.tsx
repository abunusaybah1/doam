import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminOverview() {
  const supabase = await createClient();

  const [
    { count: solverCount },
    { count: claimCount },
    { count: deletionCount },
    { count: totalProblems },
    { count: bannedCount },
  ] = await Promise.all([
    supabase
      .from("user_profiles")
      .select("id", { count: "exact", head: true })
      .eq("is_solver", false)
      .not("solver_applied_at", "is", null),
    supabase
      .from("claims")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending_approval"),
    supabase
      .from("problems")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending_delete"),
    supabase.from("problems").select("id", { count: "exact", head: true }),
    supabase
      .from("user_profiles")
      .select("id", { count: "exact", head: true })
      .eq("is_banned", true),
  ]);

  const cards = [
    {
      label: "Solver applications",
      count: solverCount ?? 0,
      href: "/admin/solvers",
    },
    { label: "Claim approvals", count: claimCount ?? 0, href: "/admin/claims" },
    {
      label: "Deletion requests",
      count: deletionCount ?? 0,
      href: "/admin/deletions",
    },
    {
      label: "Total problems",
      count: totalProblems ?? 0,
      href: "/admin/problems",
    },
    { label: "Banned users", count: bannedCount ?? 0, href: "/admin/users" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-playfair text-3xl text-parch">Admin overview</h1>
      <div className="flex flex-wrap gap-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="flex-1 min-w-[180px] bg-surface border border-border hover:border-orange/40 transition-colors px-6 py-6"
          >
            <div className="font-playfair text-4xl text-orange mb-1">
              {c.count}
            </div>
            <div className="text-[0.68rem] uppercase tracking-widest text-umber">
              {c.label}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
