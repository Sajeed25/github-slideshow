"use client";
import { motion, useReducedMotion } from "framer-motion";
import { Briefcase, Building2, GraduationCap, UserPlus, BookOpen, ShieldCheck, Eye, PartyPopper } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

const problems = [
  { Icon: GraduationCap, who: "Students", text: "Skills are real, but there's no experience to show for them." },
  { Icon: Briefcase, who: "Employers", text: "A CV can't tell you who can actually do the work." },
  { Icon: Building2, who: "Colleges", text: "Great students, limited reach to the recruiters who need them." },
];

export function Problem() {
  return (
    <section className="section">
      <div className="container">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">The problem</p>
          <h2 className="h-section mt-3">Talent is everywhere. <span className="text-gradient">Proof isn&apos;t.</span></h2>
          <p className="mt-5 text-lg text-ink-soft">Other platforms list jobs. Kalwings builds the proof that gets you hired.</p>
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {problems.map(({ Icon, who, text }, i) => (
            <Reveal key={who} delay={i * 0.08}>
              <div className="card card-hover h-full p-8">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-muted"><Icon className="h-6 w-6" /></span>
                <h3 className="mt-6 text-2xl">{who}</h3>
                <p className="mt-2 text-ink-soft">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  { Icon: UserPlus, t: "Join", d: "Create your free profile in minutes." },
  { Icon: BookOpen, t: "Learn", d: "Grow with the community and mentors." },
  { Icon: ShieldCheck, t: "Prove", d: "Back your skills with projects and challenges." },
  { Icon: Eye, t: "Get noticed", d: "Verified employers find your Talent Card." },
  { Icon: PartyPopper, t: "Get hired", d: "Apply, interview and land the role." },
];

export function Journey() {
  const reduce = useReducedMotion();
  return (
    <section className="section bg-muted">
      <div className="container">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">How Kalwings works</p>
          <h2 className="h-section mt-3">Five steps from potential to proof to offer.</h2>
        </Reveal>
        <div className="relative mt-16">
          <svg aria-hidden className="absolute left-0 right-0 top-6 hidden h-1 w-full lg:block" preserveAspectRatio="none" viewBox="0 0 100 1">
            <defs><linearGradient id="jl"><stop offset="0" stopColor="#14B8A6" /><stop offset="1" stopColor="#38BDF8" /></linearGradient></defs>
            <line x1="10" y1=".5" x2="90" y2=".5" stroke="rgb(var(--line))" strokeWidth=".6" vectorEffect="non-scaling-stroke" />
            <motion.line x1="10" y1=".5" x2="90" y2=".5" stroke="url(#jl)" strokeWidth=".6" vectorEffect="non-scaling-stroke"
              initial={reduce ? false : { pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true, margin: "-120px" }} transition={{ duration: 1.8, ease: "easeInOut" }} />
          </svg>
          <ol className="grid gap-10 lg:grid-cols-5">
            {steps.map(({ Icon, t, d }, i) => (
              <Reveal as="li" key={t} delay={i * 0.1} className="relative lg:text-center">
                <span className="relative z-10 grid h-12 w-12 place-items-center rounded-full bg-navy text-white ring-8 ring-muted lg:mx-auto"><Icon className="h-5 w-5" /></span>
                <p className="mt-5 text-sm font-semibold text-teal-700 dark:text-teal">Step {i + 1}</p>
                <h3 className="mt-1 text-xl">{t}</h3>
                <p className="mt-1 text-[15px] text-ink-soft">{d}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
