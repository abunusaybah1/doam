import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import EditProblemForm from "@/components/problems/EditProblemForm";

export default async function EditProblemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirectTo=/problems/${id}/edit`);

  const { data: problem } = await supabase
    .from("problems")
    .select("*")
    .eq("id", id)
    .single();

  if (!problem) notFound();
  if (problem.reporter_id !== user.id) notFound();
  if (problem.status !== "pending") {
    redirect(`/problems/${id}`);
  }

  const { data: images } = await supabase
    .from("problem_images")
    .select("id, image_url, position")
    .eq("problem_id", id)
    .order("position", { ascending: true });

  return (
    <main className="min-h-screen bg-bark">
      <div className="max-w-2xl mx-auto px-5 md:px-10 py-10">
        <div className="mb-10 border-b border-border pb-8">
          <p className="text-[0.7rem] uppercase tracking-widest text-umber mb-1">
            Editing report
          </p>
          <h1 className="font-playfair text-3xl md:text-4xl text-parch">
            {problem.heading}
          </h1>
        </div>

        <EditProblemForm problem={problem} existingImages={images ?? []} />
      </div>
    </main>
  );
}
