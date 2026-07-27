import { createClient } from "@/lib/supabase/server";
import SolverApplicationRow from "@/components/admin/SolverApplicationRow";

export default async function AdminSolversPage() {
  const supabase = await createClient();

  const { data: applicants } = await supabase
    .from("user_profiles")
    .select(
      "id, full_name, username, solver_bio, solver_skills, solver_applied_at",
    )
    .eq("is_solver", false)
    .not("solver_applied_at", "is", null)
    .order("solver_applied_at", { ascending: true });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-playfair text-3xl text-parch">Solver applications</h1>
      {!applicants?.length ? (
        <p className="text-[0.85rem] text-parch/60">No pending applications.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {applicants.map((a) => (
            <SolverApplicationRow key={a.id} applicant={a} />
          ))}
        </div>
      )}
    </div>
  );
}
