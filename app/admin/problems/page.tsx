import { createClient } from "@/lib/supabase/server";
import AdminProblemRow from "@/components/admin/AdminProblemRow";

export default async function AdminProblemsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const supabase = await createClient();
  const { q, status } = await searchParams;

  let query = supabase
    .from("problems")
    .select(
      "id, heading, status, category, condition, state, lga, reporter_id, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(50);

  if (status) query = query.eq("status", status);
  if (q && q.trim()) query = query.ilike("heading", `%${q.trim()}%`);

  const { data: problems, error } = await query;

  if (error) console.error("Admin problems query failed:", error.message);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-playfair text-3xl text-parch">All problems</h1>

      <form className="flex gap-2 flex-wrap">
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search by heading"
          className="bg-parch border-2 border-parch outline-none px-4 py-2.5 text-[0.9rem] text-bark flex-1 min-w-[200px]"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="bg-parch border-2 border-parch outline-none px-4 py-2.5 text-[0.9rem] text-bark"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="in_progress">In progress</option>
          <option value="completed">Completed</option>
          <option value="pending_delete">Pending delete</option>
        </select>
        <button
          type="submit"
          className="bg-orange text-parch text-[0.7rem] uppercase tracking-widest px-5 py-2.5 hover:bg-ember transition-colors"
        >
          Filter
        </button>
      </form>

      {error && (
        <p className="text-[0.78rem] text-red-500 border-l-2 border-red-500 pl-3">
          Query failed: {error.message}
        </p>
      )}

      <div className="flex flex-col gap-3">
        {(problems ?? []).map((p) => (
          <AdminProblemRow key={p.id} problem={p} />
        ))}
        {!problems?.length && (
          <p className="text-[0.85rem] text-parch/60">No problems found.</p>
        )}
      </div>
    </div>
  );
}
