import Image from "next/image";
import { resolveImageUrl } from "@/lib/cms";
import type { AboutPageContent } from "@/types/cms";

export default function AboutGallery({
  eyebrow,
  heading,
  description,
  images,
}: AboutPageContent["gallery"]) {
  if (!images || images.length === 0) return null;

  return (
    <section className="bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-navy/60">{eyebrow}</p>
          <h2 className="mt-3 font-display text-[30px] font-medium leading-tight text-navy-deeper md:text-[40px]">
            {heading}
          </h2>
          {description && <p className="mt-3 text-sm leading-relaxed text-ink/60">{description}</p>}
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((item, i) => (
            <div
              key={item.id}
              className={`group relative aspect-square overflow-hidden rounded-xl bg-mist ${
                i === 0 ? "col-span-2 row-span-2 aspect-square sm:aspect-auto" : ""
              }`}
            >
              <Image
                src={resolveImageUrl(item.image)}
                alt={item.caption || ""}
                fill
                sizes="(min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {item.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-deeper/80 via-navy-deeper/0 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="text-[12px] font-medium text-white">{item.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
