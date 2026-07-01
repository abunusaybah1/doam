import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { GrLocation } from "react-icons/gr";
import ImageGallery from "@/components/problems/ImageGallery";
import VideoEmbed from "@/components/problems/VideoEmbed";
import EndorseButton from "@/components/problems/EndorseButton";
import ClaimSection from "@/components/problems/ClaimSection";

export default async function ProblemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: problem } = await supabase
    .from("problems")
    .select("*")
    .eq("id", id)
    .single();

  if (!problem) notFound();

  const { data: images } = await supabase
    .from("problem_images")
    .select("id, image_url, position")
    .eq("problem_id", id)
    .order("position", { ascending: true });

  let hasEndorsed = false;
  let userProfile = null;

  if (user) {
    const { data: endorsement } = await supabase
      .from("problem_endorsements")
      .select("id")
      .eq("problem_id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    hasEndorsed = !!endorsement;

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("username, phone, state, lga, is_solver")
      .eq("id", user.id)
      .single();

    userProfile = profile;
  }

  const { data: activeClaim } = await supabase
    .from("claims")
    .select("id, solver_id, plan, timeline, claimed_at")
    .eq("problem_id", id)
    .eq("status", "active")
    .maybeSingle();

  const statusLabel: Record<string, string> = {
    active: "Available",
    in_progress: "In progress",
    completed: "Solved",
  };

  const statusColor: Record<string, string> = {
    active: "bg-blue-600",
    in_progress: "bg-amber-500",
    completed: "bg-green-600",
  };

  return (
    <main className="min-h-screen bg-bark">
      <div className="px-6 md:px-10 py-10 flex flex-col gap-8 max-w-4xl mx-auto">
        <ImageGallery images={images ?? []} heading={problem.heading} />

        {problem.video_link && <VideoEmbed url={problem.video_link} />}

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-[10px] text-parch ${
                statusColor[problem.status] ?? "bg-umber"
              } px-2.5 py-1 rounded-full uppercase font-bold tracking-wide`}
            >
              {statusLabel[problem.status] ?? problem.status}
            </span>
            <span
              className={`text-[10px] text-parch ${
                problem.condition === "emergency"
                  ? "bg-red-500"
                  : problem.condition === "critical"
                    ? "bg-orange-500"
                    : "bg-green-600"
              } px-2.5 py-1 rounded-full uppercase font-bold tracking-wide`}
            >
              {problem.condition}
            </span>
            <p className="flex items-center gap-1 text-[0.75rem] text-umber">
              <GrLocation />
              {problem.lga}, {problem.state}
            </p>
          </div>

          <h1 className=" text-3xl md:text-4xl text-parch leading-tight">
            {problem.heading}
          </h1>
          <div className="sm:block md:flex md:items-center md:gap-2">
            <p className="text-[0.7rem] uppercase tracking-widest text-umber sm:mb-1">
              Started {problem.duration} ago
            </p>
            <span className="hidden md:inline text-umber">|</span>
            <p className="text-[0.7rem] uppercase tracking-widest text-umber">
              Category: {problem.category}
            </p>
          </div>
        </div>

        <p className="text-[0.95rem] text-parch leading-relaxed whitespace-pre-line">
          {problem.description}
        </p>

        <div className="flex flex-col gap-2 border-t border-border pt-6">
          <p className="text-[0.85rem] text-parch">
            <span className="">Location:</span>
            {problem.address && ` ${problem.address}, `} 
            {problem.lga}, {problem.state}
          </p>
          {problem.people_affected && (
            <p className="text-[0.85rem] text-parch">
              <span className="">People affected:</span>{" "}
              {problem.people_affected}
            </p>
          )}
        </div>

        <EndorseButton
          problemId={problem.id}
          initialCount={problem.endorsement_count}
          initialEndorsed={hasEndorsed}
          isLoggedIn={!!user}
        />

        <ClaimSection
          problemId={problem.id}
          problemStatus={problem.status}
          isLoggedIn={!!user}
          isSolver={userProfile?.is_solver ?? false}
          activeClaim={activeClaim}
          currentUserId={user?.id ?? null}
        />
      </div>
    </main>
  );
}
