import Image from "next/image";
import { homeProjects } from "@/data/home";
import Reveal from "@/components/ui/Reveal";

export default function ProjectStoryMobile() {
  return (
    <div className="mt-8 flex flex-col gap-8 px-5">
      {homeProjects.map((project, i) => (
        <Reveal key={project.id} y={20}>
          <div className="overflow-hidden rounded-3xl bg-navy-deeper shadow-xl shadow-navy-deeper/20">
            <div className="relative h-[26vh] w-full">
              <Image
                src={project.image}
                alt={project.name}
                fill
                sizes="100vw"
                loading={i === 0 ? "eager" : "lazy"}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deeper/70 via-transparent to-transparent" />
            </div>
            <div className="px-6 py-6">
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-teal-light">
                {project.category} &middot; {String(i + 1).padStart(2, "0")}/
                {String(homeProjects.length).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-[20px] font-medium leading-tight text-white">
                {project.name}
              </h3>
              <p className="mt-2.5 text-[14px] leading-relaxed text-white/60">
                {project.description}
              </p>
              <div className="mt-4 flex gap-6 text-[13px] text-white/45">
                <span>{project.location}</span>
                <span>{project.status}</span>
              </div>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
