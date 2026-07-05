import Image from "next/image";
import { GrLocation } from "react-icons/gr";
import OwnerActionsBar from "./OwnerActionsBar";

type Problem = {
  id: string;
  status: string;
  heading: string;
  description: string;
  category: string;
  condition: string;
  state: string;
  lga: string;
  address: string | null;
  people_affected: number | null;
  duration: string;
  video_link: string | null;
};

type ProblemImage = {
  id: string;
  image_url: string;
};

export default function PendingReviewView({
  problem,
  images,
}: {
  problem: Problem;
  images: ProblemImage[];
}) {
  const isPendingDelete = problem.status === "pending_delete";

  return (
    <main className="min-h-screen bg-bark">
      <div className="px-6 md:px-10 py-10 flex flex-col gap-6 max-w-3xl mx-auto">
        {isPendingDelete ? (
          <div className="bg-surface border border-red-500/40 px-5 py-4 flex flex-col gap-1.5">
            <p className="text-[0.68rem] uppercase tracking-widest text-red-500">
              Deletion pending
            </p>
            <p className="text-[0.85rem] text-parch/80 leading-relaxed">
              You&apos;ve requested this report be removed. It&apos;s no longer
              visible to anyone else, and an admin will process the removal
              shortly. If you change your mind, contact an admin — this
              can&apos;t be undone from here once submitted.
            </p>
          </div>
        ) : (
          <div className="bg-surface border border-orange/40 px-5 py-4 flex flex-col gap-1.5">
            <p className="text-[0.68rem] uppercase tracking-widest text-orange">
              Awaiting review
            </p>
            <p className="text-[0.85rem] text-parch/80 leading-relaxed">
              This report hasn&apos;t been approved yet, so it&apos;s not
              visible to anyone else. Review what you entered below — if
              anything is wrong, edit it before it goes live.
            </p>
          </div>
        )}

        <OwnerActionsBar
          problemId={problem.id}
          status={problem.status}
          hasActiveClaim={false}
        />

        <div className="flex flex-col gap-5 border-t border-border pt-6">
          <div className="flex flex-col gap-1">
            <p className="text-[0.65rem] uppercase tracking-widest text-umber">
              Heading
            </p>
            <p className="text-parch text-lg">{problem.heading}</p>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-[0.65rem] uppercase tracking-widest text-umber">
              Description
            </p>
            <p className="text-parch/90 text-[0.9rem] leading-relaxed whitespace-pre-line">
              {problem.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-[0.65rem] uppercase tracking-widest text-umber">
                Category
              </p>
              <p className="text-parch text-[0.9rem]">{problem.category}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-[0.65rem] uppercase tracking-widest text-umber">
                Condition
              </p>
              <p className="text-parch text-[0.9rem] capitalize">
                {problem.condition}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-[0.65rem] uppercase tracking-widest text-umber">
              Location
            </p>
            <p className="flex items-center gap-1 text-parch text-[0.9rem]">
              <GrLocation className="shrink-0" />
              {problem.address && `${problem.address}, `}
              {problem.lga}, {problem.state}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-[0.65rem] uppercase tracking-widest text-umber">
                Duration so far
              </p>
              <p className="text-parch text-[0.9rem]">{problem.duration}</p>
            </div>
            {problem.people_affected && (
              <div className="flex flex-col gap-1">
                <p className="text-[0.65rem] uppercase tracking-widest text-umber">
                  People affected
                </p>
                <p className="text-parch text-[0.9rem]">
                  {problem.people_affected}
                </p>
              </div>
            )}
          </div>

          {problem.video_link && (
            <div className="flex flex-col gap-1">
              <p className="text-[0.65rem] uppercase tracking-widest text-umber">
                Video link
              </p>
              <p className="text-orange text-[0.9rem] break-all">
                {problem.video_link}
              </p>
            </div>
          )}

          {images.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-[0.65rem] uppercase tracking-widest text-umber">
                Photos
              </p>
              <div className="flex gap-3 flex-wrap">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className="relative w-28 h-28 bg-surface overflow-hidden"
                  >
                    <Image
                      src={img.image_url}
                      alt={problem.heading}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
