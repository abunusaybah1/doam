import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function AuditLogPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("is_super_admin")
    .eq("id", user?.id ?? "")
    .single();

  // redundant with the layout's check on purpose — verified independently
  // since this page is sensitive enough not to trust the layout alone
  if (!profile?.is_super_admin) notFound();

  const { data: logs } = await supabase
    .from("audit_logs")
    .select(
      "id, admin_email, action, target_type, target_id, details, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-playfair text-3xl text-parch">Audit log</h1>
      <div className="flex flex-col gap-2">
        {(logs ?? []).map((log) => (
          <div
            key={log.id}
            className="flex flex-col gap-1 bg-surface border border-border px-5 py-3"
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <p className="text-[0.85rem] text-parch">
                <span className="text-orange">
                  {log.admin_email ?? "Unknown admin"}
                </span>{" "}
                — {log.action.replace(/_/g, " ")}
              </p>
              <p className="text-[0.68rem] uppercase tracking-widest text-umber">
                {new Date(log.created_at).toLocaleString()}
              </p>
            </div>
            <p className="text-[0.72rem] text-parch/50">
              {log.target_type} · {log.target_id}
              {log.details && ` · ${JSON.stringify(log.details)}`}
            </p>
          </div>
        ))}
        {!logs?.length && (
          <p className="text-[0.85rem] text-parch/60">
            No admin actions logged yet.
          </p>
        )}
      </div>
    </div>
  );
}
