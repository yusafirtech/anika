import Link from "next/link";
import AutoImageSwiper from "@/components/ui/AutoImageSwiper";
import type { TeamPageContent } from "@/types/cms";
import type { Dictionary } from "@/i18n/dictionaries";

const AVATAR_GRADIENTS = [
  "from-navy to-navy-dark",
  "from-navy to-teal",
  "from-teal to-violet",
  "from-navy-dark to-navy",
  "from-teal to-navy-dark",
  "from-violet to-navy",
];

export default function AboutTeamPreview({
  members,
  dict,
}: {
  members: TeamPageContent["members"];
  dict: Dictionary["aboutExtra"];
}) {
  const preview = members.slice(0, 4);
  if (preview.length === 0) return null;

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div className="flex flex-col items-start justify-between gap-5 border-b border-black/10 pb-8 md:flex-row md:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-navy/60">
              {dict.teamPreviewEyebrow}
            </p>
            <h2 className="mt-3 font-display text-[30px] font-medium leading-tight text-navy-deeper md:text-[40px]">
              {dict.teamPreviewHeading}
            </h2>
          </div>
          <Link
            href="/team"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-navy/20 px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-navy hover:text-white"
          >
            {dict.viewFullTeam} <span aria-hidden>&rarr;</span>
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {preview.map((member, i) => (
            <Link key={member.id} href="/team" className="group flex flex-col items-center text-center">
              <div
                className={`relative h-24 w-24 overflow-hidden rounded-full bg-gradient-to-br shadow-sm transition-transform duration-300 group-hover:scale-105 md:h-28 md:w-28 ${
                  AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]
                }`}
              >
                {(member.images?.length || member.image) && (
                  <AutoImageSwiper
                    images={member.images?.length ? member.images : [member.image as string]}
                    alt={member.name}
                    sizes="112px"
                    className="object-cover"
                  />
                )}
              </div>
              <p className="mt-3 text-sm font-semibold text-navy-deeper">{member.name}</p>
              <p className="mt-0.5 text-xs text-ink/55">{member.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
