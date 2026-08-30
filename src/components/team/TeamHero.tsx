import Reveal from "@/components/ui/Reveal";

export default function TeamHero() {
  return (
    <section className="relative bg-navy-deeper overflow-hidden">
      {/* Decorative gradient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-navy/60 blur-[120px] opacity-60" />
        <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-teal/20 blur-[100px] opacity-40" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[300px] w-[600px] rounded-full bg-violet/15 blur-[80px] opacity-30" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-36 md:pb-32 md:pt-44 md:px-8">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-teal-light">
            Our People
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="mt-5 max-w-2xl font-display text-[38px] font-medium leading-[1.07] text-white md:text-[58px]">
            The Team Behind{" "}
            <span className="brand-gradient-text">ANIKA</span>
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/55">
            ANIKA TRADING & CO. is built on people who understand their sectors deeply.
            Each team member brings domain-specific expertise — from construction and
            government procurement to international trade and finance — contributing to
            a company that operates with precision across multiple industries.
          </p>
        </Reveal>
        <Reveal delay={0.22}>
          <div className="mt-10 flex flex-wrap gap-6">
            {[
              { value: "6+", label: "Leadership Members" },
              { value: "15+", label: "Years Combined" },
              { value: "5", label: "Business Sectors" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-sm"
              >
                <p className="font-display text-3xl font-semibold brand-gradient-text">
                  {stat.value}
                </p>
                <p className="mt-1 text-[12px] font-medium uppercase tracking-wider text-white/40">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
