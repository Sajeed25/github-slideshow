import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { mentors } from "@/data/sample";
import { Block, DraftNotice } from "@/components/pages/shell";
import { Badge, PhotoPlaceholder } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamicParams = false;
export const generateStaticParams = () => mentors.map((m) => ({ slug: m.slug }));
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const m = mentors.find((x) => x.slug === slug);
  return { title: m ? `${m.name} — Mentor` : "Mentor", robots: { index: false } };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = mentors.find((x) => x.slug === slug);
  if (!m) notFound();
  return (
    <Block>
      <Link href="/mentors" className="text-sm font-semibold text-teal-700 dark:text-teal">← All mentors</Link>
      <div className="mt-6 grid gap-10 md:grid-cols-[320px_1fr]">
        <PhotoPlaceholder label="mentor" className="aspect-[4/5] rounded-card-lg" />
        <div>
          <h1 className="text-4xl font-extrabold md:text-5xl">{m.name} <span aria-label={m.country}>{m.flag}</span></h1>
          <p className="mt-2 text-lg text-ink-soft">{m.role} · {m.company}</p>
          <ul className="mt-4 flex flex-wrap gap-2">{m.tags.map((t) => <li key={t}><Badge tone="teal">{t}</Badge></li>)}</ul>
          <p className="mt-6 text-ink-soft">[Sample bio] Add 2–3 sentences about this mentor’s background and how they like to help.</p>
          <p className="mt-4"><b>{m.available ? "Taking session requests" : "Not taking requests right now"}</b></p>
          <div className="mt-6"><DraftNotice>Sample profile. Real mentors are verified by Kalwings before they are listed.</DraftNotice></div>
          <Button asChild size="lg" className="mt-8" disabled={!m.available}><Link href="/join">Request a session</Link></Button>
        </div>
      </div>
    </Block>
  );
}
