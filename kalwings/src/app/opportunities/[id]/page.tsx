import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { opportunities } from "@/data/sample";
import { Block, DraftNotice } from "@/components/pages/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

export const dynamicParams = false;
export const generateStaticParams = () => opportunities.map((o) => ({ id: o.id }));

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const o = opportunities.find((x) => x.id === id);
  return { title: o ? `${o.role} at ${o.company}` : "Opportunity", robots: { index: false } };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const o = opportunities.find((x) => x.id === id);
  if (!o) notFound();
  // schema.org JobPosting (sample data: do not index until real).
  const ld = {
    "@context": "https://schema.org", "@type": "JobPosting", title: o.role, employmentType: o.type === "Job" ? "FULL_TIME" : "INTERN",
    hiringOrganization: { "@type": "Organization", name: o.company }, jobLocation: { "@type": "Place", address: o.location },
    jobLocationType: o.mode === "Remote" ? "TELECOMMUTE" : undefined, validThrough: o.deadline, url: `${site.url}/opportunities/${o.id}`,
  };
  return (
    <Block>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <Link href="/opportunities" className="text-sm font-semibold text-teal-700 dark:text-teal">← All opportunities</Link>
      <div className="mt-6 max-w-3xl">
        <Badge tone="teal">{o.type}</Badge>
        <h1 className="mt-3 text-4xl font-extrabold md:text-5xl">{o.role}</h1>
        <p className="mt-2 text-lg text-ink-soft">{o.company}{o.verified && " · Verified employer ✓"}</p>
        <dl className="card mt-8 grid gap-6 p-6 sm:grid-cols-2">
          {[["Pay", o.pay + (o.unpaid ? " (Unpaid)" : "")], ["Location", o.location], ["Work mode", o.mode], ["Eligibility", o.eligibility], ["Deadline", o.deadline], ["Skills", o.skills.join(", ")]].map(([k, v]) => (
            <div key={k}><dt className="text-sm text-ink-soft">{k}</dt><dd className="font-semibold">{v}</dd></div>
          ))}
        </dl>
        <div className="mt-6"><DraftNotice>Sample listing. Applying requires a Kalwings account; we never promise a guaranteed job.</DraftNotice></div>
        <Button asChild size="lg" className="mt-8"><Link href="/join">Apply with my Talent Card</Link></Button>
      </div>
    </Block>
  );
}
