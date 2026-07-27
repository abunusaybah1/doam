import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("is_admin, is_super_admin, is_banned")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin || profile.is_banned) notFound();

  const navItems = [
    { label: "Overview", href: "/admin" },
    { label: "Solver applications", href: "/admin/solvers" },
    { label: "Claim approvals", href: "/admin/claims" },
    { label: "Deletion requests", href: "/admin/deletions" },
    { label: "Solution reviews", href: "/admin/solutions" },
    { label: "All problems", href: "/admin/problems" },
    { label: "Users", href: "/admin/users" },
  ];

  if (profile.is_super_admin) {
    navItems.push({ label: "Audit log", href: "/admin/audit-log" });
  }

  return (
    <main className="min-h-screen bg-bark">
      {/* sub-nav strip — sits under the global Navbar, not a second one */}
      <div className="border-b border-border bg-surface/40">
        <div className="max-w-5xl mx-auto px-5 md:px-10 py-3 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-5 flex-wrap overflow-x-auto">
            <span className="text-[0.65rem] uppercase tracking-widest text-umber shrink-0">
              Admin
            </span>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[0.68rem] uppercase tracking-widest text-parch/60 hover:text-orange transition-colors whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <span className="text-[0.62rem] uppercase tracking-widest text-orange border border-orange/30 px-2 py-0.5 shrink-0">
            {profile.is_super_admin ? "Super admin" : "Admin"}
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 md:px-10 py-10">{children}</div>
    </main>
  );
}
