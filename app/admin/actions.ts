"use server";

import {
  requireAdmin,
  requireSuperAdmin,
  logAdminAction,
} from "@/lib/admin/auth";
import {
  checkAdminRateLimit,
  generalLimit,
  destructiveLimit,
} from "@/lib/admin/rateLimit";
import { revalidatePath } from "next/cache";

// ---- solver applications ----

export async function approveSolver(userId: string) {
  const { supabase, adminId, adminEmail, error } = await requireAdmin();
  if (!supabase || !adminId) return { error };

  const rateLimitError = await checkAdminRateLimit(
    supabase,
    adminId,
    generalLimit(),
  );
  if (rateLimitError) return { error: rateLimitError };

  const { error: updateError } = await supabase
    .from("user_profiles")
    .update({ is_solver: true, updated_at: new Date().toISOString() })
    .eq("id", userId);

  if (updateError) return { error: updateError.message };

  await logAdminAction(
    supabase,
    adminId,
    adminEmail,
    "approve_solver",
    "user_profile",
    userId,
  );
  revalidatePath("/admin/solvers");
  return { success: true };
}

export async function rejectSolver(userId: string) {
  const { supabase, adminId, adminEmail, error } = await requireAdmin();
  if (!supabase || !adminId) return { error };

  const rateLimitError = await checkAdminRateLimit(
    supabase,
    adminId,
    generalLimit(),
  );
  if (rateLimitError) return { error: rateLimitError };

  const { error: updateError } = await supabase
    .from("user_profiles")
    .update({
      is_solver: false,
      solver_applied_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (updateError) return { error: updateError.message };

  await logAdminAction(
    supabase,
    adminId,
    adminEmail,
    "reject_solver",
    "user_profile",
    userId,
  );
  revalidatePath("/admin/solvers");
  return { success: true };
}

// ---- claim approvals ----

export async function approveClaim(claimId: string) {
  const { supabase, adminId, adminEmail, error } = await requireAdmin();
  if (!supabase || !adminId) return { error };

  const rateLimitError = await checkAdminRateLimit(
    supabase,
    adminId,
    generalLimit(),
  );
  if (rateLimitError) return { error: rateLimitError };

  const { data: claim } = await supabase
    .from("claims")
    .select("id, problem_id, solver_id, status")
    .eq("id", claimId)
    .single();

  if (!claim || claim.status !== "pending_approval") {
    return { error: "Claim not found or not pending approval" };
  }

  const { error: claimError } = await supabase
    .from("claims")
    .update({ status: "active" })
    .eq("id", claimId);
  if (claimError) return { error: claimError.message };

  const { error: problemError } = await supabase
    .from("problems")
    .update({ status: "in_progress", solver_id: claim.solver_id })
    .eq("id", claim.problem_id);
  if (problemError) return { error: problemError.message };

  await logAdminAction(
    supabase,
    adminId,
    adminEmail,
    "approve_claim",
    "claim",
    claimId,
    { problem_id: claim.problem_id },
  );
  revalidatePath("/admin/claims");
  revalidatePath(`/problems/${claim.problem_id}`);
  return { success: true };
}

export async function rejectClaim(claimId: string, reason: string) {
  const { supabase, adminId, adminEmail, error } = await requireAdmin();
  if (!supabase || !adminId) return { error };

  const rateLimitError = await checkAdminRateLimit(
    supabase,
    adminId,
    generalLimit(),
  );
  if (rateLimitError) return { error: rateLimitError };

  const { data: claim } = await supabase
    .from("claims")
    .select("id, problem_id, status")
    .eq("id", claimId)
    .single();

  if (!claim || claim.status !== "pending_approval") {
    return { error: "Claim not found or not pending approval" };
  }

  // a rejected claim was never approved — it never had a real
  // commitment to break, so it's not "abandoned"
  const { error: claimError } = await supabase
    .from("claims")
    .update({
      status: "rejected",
      abandoned_at: new Date().toISOString(),
      abandon_reason: reason || "Rejected by admin",
    })
    .eq("id", claimId);

  if (claimError) return { error: claimError.message };

  const { data: otherActiveClaim } = await supabase
    .from("claims")
    .select("id")
    .eq("problem_id", claim.problem_id)
    .eq("status", "active")
    .maybeSingle();

  if (!otherActiveClaim) {
    const { data: problem } = await supabase
      .from("problems")
      .select("status")
      .eq("id", claim.problem_id)
      .single();

    if (problem?.status === "in_progress") {
      await supabase
        .from("problems")
        .update({
          status: "active",
          solver_id: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", claim.problem_id);
    }
  }

  await logAdminAction(
    supabase,
    adminId,
    adminEmail,
    "reject_claim",
    "claim",
    claimId,
    { reason, problem_id: claim.problem_id },
  );
  revalidatePath("/admin/claims");
  revalidatePath(`/problems/${claim.problem_id}`);
  return { success: true };
}

// ---- deletion requests ----

export async function approveDeletion(problemId: string) {
  const { supabase, adminId, adminEmail, error } = await requireAdmin();
  if (!supabase || !adminId) return { error };

  const rateLimitError = await checkAdminRateLimit(
    supabase,
    adminId,
    destructiveLimit(),
  );
  if (rateLimitError) return { error: rateLimitError };

  const { data: problem } = await supabase
    .from("problems")
    .select("id, status, heading")
    .eq("id", problemId)
    .single();

  if (!problem || problem.status !== "pending_delete") {
    return { error: "Problem not found or not pending deletion" };
  }

  await supabase.from("problem_images").delete().eq("problem_id", problemId);
  await supabase
    .from("problem_endorsements")
    .delete()
    .eq("problem_id", problemId);
  await supabase.from("solution_reports").delete().eq("problem_id", problemId);
  await supabase.from("claims").delete().eq("problem_id", problemId);

  const { error: deleteError } = await supabase
    .from("problems")
    .delete()
    .eq("id", problemId);
  if (deleteError) return { error: deleteError.message };

  await logAdminAction(
    supabase,
    adminId,
    adminEmail,
    "approve_deletion",
    "problem",
    problemId,
    { heading: problem.heading },
  );
  revalidatePath("/admin/deletions");
  return { success: true };
}

export async function rejectDeletion(problemId: string) {
  const { supabase, adminId, adminEmail, error } = await requireAdmin();
  if (!supabase || !adminId) return { error };

  const rateLimitError = await checkAdminRateLimit(
    supabase,
    adminId,
    generalLimit(),
  );
  if (rateLimitError) return { error: rateLimitError };

  const { data: problem } = await supabase
    .from("problems")
    .select("id, status, pre_delete_status")
    .eq("id", problemId)
    .single();

  if (!problem || problem.status !== "pending_delete") {
    return { error: "Problem not found or not pending deletion" };
  }

  const { error: updateError } = await supabase
    .from("problems")
    .update({
      status: problem.pre_delete_status ?? "active",
      pre_delete_status: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", problemId);

  if (updateError) return { error: updateError.message };

  await logAdminAction(
    supabase,
    adminId,
    adminEmail,
    "reject_deletion",
    "problem",
    problemId,
  );
  revalidatePath("/admin/deletions");
  revalidatePath(`/problems/${problemId}`);
  return { success: true };
}

// ---- force delete (any status, immediate — destructive) ----

export async function forceDeleteProblem(problemId: string) {
  const { supabase, adminId, adminEmail, error } = await requireAdmin();
  if (!supabase || !adminId) return { error };

  const rateLimitError = await checkAdminRateLimit(
    supabase,
    adminId,
    destructiveLimit(),
  );
  if (rateLimitError) return { error: rateLimitError };

  const { data: problem } = await supabase
    .from("problems")
    .select("id, heading, status")
    .eq("id", problemId)
    .single();

  if (!problem) return { error: "Problem not found" };

  await supabase.from("problem_images").delete().eq("problem_id", problemId);
  await supabase
    .from("problem_endorsements")
    .delete()
    .eq("problem_id", problemId);
  await supabase.from("solution_reports").delete().eq("problem_id", problemId);
  await supabase.from("claims").delete().eq("problem_id", problemId);

  const { error: deleteError } = await supabase
    .from("problems")
    .delete()
    .eq("id", problemId);
  if (deleteError) return { error: deleteError.message };

  await logAdminAction(
    supabase,
    adminId,
    adminEmail,
    "force_delete_problem",
    "problem",
    problemId,
    {
      heading: problem.heading,
      prior_status: problem.status,
    },
  );
  revalidatePath("/admin/problems");
  return { success: true };
}

export async function adminUpdateProblemStatus(
  problemId: string,
  status: string,
) {
  const { supabase, adminId, adminEmail, error } = await requireAdmin();
  if (!supabase || !adminId) return { error };

  const rateLimitError = await checkAdminRateLimit(
    supabase,
    adminId,
    generalLimit(),
  );
  if (rateLimitError) return { error: rateLimitError };

  const validStatuses = [
    "pending",
    "active",
    "in_progress",
    "completed",
    "pending_delete",
  ];
  if (!validStatuses.includes(status)) return { error: "Invalid status" };

  const updates: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  };

  // moving a problem OUT of in_progress via the generic dropdown leaves
  // any live claim orphaned unless we clean it up here too — the claim
  // and problem tables aren't linked by a trigger, so this has to be explicit
  if (status !== "in_progress") {
    updates.solver_id = null;

    const { data: liveClaims } = await supabase
      .from("claims")
      .select("id")
      .eq("problem_id", problemId)
      .in("status", ["active", "pending_approval"]);

    if (liveClaims?.length) {
      await supabase
        .from("claims")
        .update({
          status: "abandoned",
          abandoned_at: new Date().toISOString(),
          abandon_reason: "Problem status changed directly by admin",
        })
        .in(
          "id",
          liveClaims.map((c) => c.id),
        );
    }
  }

  const { error: updateError } = await supabase
    .from("problems")
    .update(updates)
    .eq("id", problemId);

  if (updateError) return { error: updateError.message };

  await logAdminAction(
    supabase,
    adminId,
    adminEmail,
    "change_problem_status",
    "problem",
    problemId,
    {
      new_status: status,
      cleared_claims: status !== "in_progress",
    },
  );
  revalidatePath("/admin/problems");
  revalidatePath(`/problems/${problemId}`);
  return { success: true };
}

// ---- user management ----

export async function banUser(userId: string) {
  const { supabase, adminId, adminEmail, error } = await requireAdmin();
  if (!supabase || !adminId) return { error };

  if (userId === adminId) return { error: "You can't ban yourself" };

  const rateLimitError = await checkAdminRateLimit(
    supabase,
    adminId,
    destructiveLimit(),
  );
  if (rateLimitError) return { error: rateLimitError };

  const { error: updateError } = await supabase
    .from("user_profiles")
    .update({ is_banned: true, updated_at: new Date().toISOString() })
    .eq("id", userId);

  if (updateError) return { error: updateError.message };

  await logAdminAction(
    supabase,
    adminId,
    adminEmail,
    "ban_user",
    "user_profile",
    userId,
  );
  revalidatePath("/admin/users");
  return { success: true };
}

export async function unbanUser(userId: string) {
  const { supabase, adminId, adminEmail, error } = await requireAdmin();
  if (!supabase || !adminId) return { error };

  const rateLimitError = await checkAdminRateLimit(
    supabase,
    adminId,
    generalLimit(),
  );
  if (rateLimitError) return { error: rateLimitError };

  const { error: updateError } = await supabase
    .from("user_profiles")
    .update({ is_banned: false, updated_at: new Date().toISOString() })
    .eq("id", userId);

  if (updateError) return { error: updateError.message };

  await logAdminAction(
    supabase,
    adminId,
    adminEmail,
    "unban_user",
    "user_profile",
    userId,
  );
  revalidatePath("/admin/users");
  return { success: true };
}

// ---- promotion — super admin only, destructive-tier limit ----

export async function promoteByEmail(
  email: string,
  role: "admin" | "super_admin",
) {
  const { supabase, adminId, adminEmail, error } = await requireSuperAdmin();
  if (!supabase || !adminId) return { error };

  const rateLimitError = await checkAdminRateLimit(
    supabase,
    adminId,
    destructiveLimit(),
  );
  if (rateLimitError) return { error: rateLimitError };

  const { data: target } = await supabase
    .from("user_profiles")
    .select("id, email, is_admin, is_super_admin")
    .eq("email", email.trim().toLowerCase())
    .maybeSingle();

  if (!target) return { error: "No user found with that email" };

  const updates =
    role === "super_admin"
      ? { is_admin: true, is_super_admin: true }
      : { is_admin: true, is_super_admin: false };

  const { error: updateError } = await supabase
    .from("user_profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", target.id);

  if (updateError)
    return { error: `Could not promote: ${updateError.message}` };

  await logAdminAction(
    supabase,
    adminId,
    adminEmail,
    "promote_user",
    "user_profile",
    target.id,
    { email, new_role: role },
  );
  revalidatePath("/admin/users");
  return { success: true };
}

export async function demoteToUser(userId: string) {
  const { supabase, adminId, adminEmail, error } = await requireSuperAdmin();
  if (!supabase || !adminId) return { error };

  if (userId === adminId) return { error: "You can't demote yourself" };

  const rateLimitError = await checkAdminRateLimit(
    supabase,
    adminId,
    destructiveLimit(),
  );
  if (rateLimitError) return { error: rateLimitError };

  const { error: updateError } = await supabase
    .from("user_profiles")
    .update({
      is_admin: false,
      is_super_admin: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (updateError) return { error: `Could not demote: ${updateError.message}` };

  await logAdminAction(
    supabase,
    adminId,
    adminEmail,
    "demote_user",
    "user_profile",
    userId,
  );
  revalidatePath("/admin/users");
  return { success: true };
}

// ---- solution report reviews ----

export async function approveSolutionReport(reportId: string) {
  const { supabase, adminId, adminEmail, error } = await requireAdmin();
  if (!supabase || !adminId) return { error };

  const rateLimitError = await checkAdminRateLimit(
    supabase,
    adminId,
    generalLimit(),
  );
  if (rateLimitError) return { error: rateLimitError };

  const { data: report } = await supabase
    .from("solution_reports")
    .select("id, claim_id, problem_id, status")
    .eq("id", reportId)
    .single();

  if (!report || report.status !== "pending_review") {
    return { error: "Report not found or not pending review" };
  }

  const now = new Date().toISOString();

  const { error: reportError } = await supabase
    .from("solution_reports")
    .update({ status: "verified", verified_at: now, verified_by: adminId })
    .eq("id", reportId);
  if (reportError) return { error: reportError.message };

  const { error: claimError } = await supabase
    .from("claims")
    .update({ status: "completed", completed_at: now })
    .eq("id", report.claim_id);
  if (claimError) return { error: claimError.message };

  const { error: problemError } = await supabase
    .from("problems")
    .update({ status: "completed", resolved_at: now, resolved_by: adminId })
    .eq("id", report.problem_id);
  if (problemError) return { error: problemError.message };

  await logAdminAction(
    supabase,
    adminId,
    adminEmail,
    "approve_solution_report",
    "solution_report",
    reportId,
    {
      problem_id: report.problem_id,
    },
  );
  revalidatePath("/admin/solutions");
  revalidatePath(`/problems/${report.problem_id}`);
  return { success: true };
}

export async function rejectSolutionReport(reportId: string, reason: string) {
  const { supabase, adminId, adminEmail, error } = await requireAdmin();
  if (!supabase || !adminId) return { error };

  const rateLimitError = await checkAdminRateLimit(
    supabase,
    adminId,
    generalLimit(),
  );
  if (rateLimitError) return { error: rateLimitError };

  const { data: report } = await supabase
    .from("solution_reports")
    .select("id, problem_id, status")
    .eq("id", reportId)
    .single();

  if (!report || report.status !== "pending_review") {
    return { error: "Report not found or not pending review" };
  }

  const { error: updateError } = await supabase
    .from("solution_reports")
    .update({
      status: "rejected",
      rejection_reason: reason || "Rejected by admin",
      verified_at: new Date().toISOString(),
      verified_by: adminId,
    })
    .eq("id", reportId);

  if (updateError) return { error: updateError.message };

  await logAdminAction(
    supabase,
    adminId,
    adminEmail,
    "reject_solution_report",
    "solution_report",
    reportId,
    { reason },
  );
  revalidatePath("/admin/solutions");
  revalidatePath(`/problems/${report.problem_id}`);
  return { success: true };
}

// ---- overdue claim confirmation — the real "abandoned" outcome ----

export async function markClaimAbandoned(claimId: string) {
  const { supabase, adminId, adminEmail, error } = await requireAdmin();
  if (!supabase || !adminId) return { error };

  const rateLimitError = await checkAdminRateLimit(supabase, adminId, generalLimit());
  if (rateLimitError) return { error: rateLimitError };

  const { data: claim } = await supabase
    .from("claims")
    .select("id, problem_id, status")
    .eq("id", claimId)
    .single();

  if (!claim || claim.status !== "active") {
    return { error: "Claim not found or not currently active" };
  }

  const { error: claimError } = await supabase
    .from("claims")
    .update({
      status: "abandoned",
      abandoned_at: new Date().toISOString(),
      abandon_reason: "Missed target completion date, confirmed by admin",
    })
    .eq("id", claimId);

  if (claimError) return { error: claimError.message };

  const { error: problemError } = await supabase
    .from("problems")
    .update({ status: "active", solver_id: null, updated_at: new Date().toISOString() })
    .eq("id", claim.problem_id);

  if (problemError) return { error: problemError.message };

  await logAdminAction(supabase, adminId, adminEmail, "mark_claim_abandoned", "claim", claimId, { problem_id: claim.problem_id });
  revalidatePath("/admin/claims");
  revalidatePath(`/problems/${claim.problem_id}`);
  return { success: true };
}