import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import MyProblems from "@/components/dashboard/MyProblems";

const STATUS_TABS = [
  {
    label: "All",
    value: null,
    emptyMessage: "You haven't reported any problems yet.",
  },
  {
    label: "Pending",
    value: "pending",
    emptyMessage: "No problems pending review.",
  },
  {
    label: "Active",
    value: "active",
    emptyMessage: "No active problems right now.",
  },
  {
    label: "In progress",
    value: "in_progress",
    emptyMessage: "No problems in progress right now.",
  },
  {
    label: "Completed",
    value: "completed",
    emptyMessage: "No completed problems yet.",
  },
];

export default async function MyReportedProblemsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { status } = await searchParams;
  const activeTab =
    STATUS_TABS.find((t) => t.value === status) ?? STATUS_TABS[0];

  let query = supabase
    .from("problems")
    .select(
      "id, heading, category, status, condition, state, lga, created_at, thumbnail_url, endorsement_count",
    )
    .eq("reporter_id", user.id)
    .order("created_at", { ascending: false });

  if (activeTab.value) {
    query = query.eq("status", activeTab.value);
  }

  const { data: problems } = await query;

  return (
    <main className="min-h-screen bg-bark p-0 m-0">
      <div className="max-w-4xl mx-auto px-5 md:px-10 py-10">
        <div className="mb-8 border-b border-border pb-8">
          <Link
            href="/dashboard"
            className="text-[0.7rem] uppercase tracking-widest text-orange hover:text-ember transition-colors mb-4 inline-block"
          >
            ← Back to dashboard
          </Link>
          <h1 className="font-playfair text-3xl md:text-4xl text-parch mt-2">
            My reported problems
          </h1>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {STATUS_TABS.map((tab) => {
            const href = tab.value
              ? `/dashboard/my-problems?status=${tab.value}`
              : "/dashboard/my-problems";
            const isActive = activeTab.value === tab.value;
            return (
              <Link
                key={tab.label}
                href={href}
                className={`text-[0.7rem] uppercase tracking-widest px-4 py-2 border transition-colors ${
                  isActive
                    ? "bg-orange text-parch border-orange"
                    : "border-border text-parch/60 hover:border-orange/50"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        {!problems?.length ? (
          <p className="text-parch/50 text-sm">{activeTab.emptyMessage}</p>
        ) : (
          <MyProblems problems={problems} />
        )}
      </div>
    </main>
  );
}
