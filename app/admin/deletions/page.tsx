import { createClient } from "@/lib/supabase/server";
import DeletionRequestRow from "@/components/admin/DeletionRequestRow";

export default async function AdminDeletionsPage() {
  const supabase = await createClient();

  const { data: problems } = await supabase
    .from("problems")
    .select("id, heading, pre_delete_status, updated_at")
    .eq("status", "pending_delete")
    .order("updated_at", { ascending: true });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-playfair text-3xl text-parch">Deletion requests</h1>
      {!problems?.length ? (
        <p className="text-[0.85rem] text-parch/60">
          No pending deletion requests.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {problems.map((p) => (
            <DeletionRequestRow key={p.id} problem={p} />
          ))}
        </div>
      )}
    </div>
  );
}
