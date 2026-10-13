import type { Metadata } from "next";
import { PageHero, Block, DraftNotice } from "@/components/pages/shell";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Contact" };
const f = "mt-1.5 w-full rounded-xl border border-line bg-surface px-3.5 py-3 text-[15px]";

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Let's talk." lead="Students, employers, colleges, mentors or press — tell us what you need." />
      <Block>
        <div className="max-w-xl">
          <DraftNotice>Form is not wired yet. Connect it to a server action with validation, rate limiting and email delivery (see README).</DraftNotice>
          <form className="mt-6 space-y-4" action="mailto:hello@kalwings.com" method="post" encType="text/plain">
            <label className="block text-sm font-semibold">Name<input required name="name" className={f} autoComplete="name" /></label>
            <label className="block text-sm font-semibold">Email<input required type="email" name="email" className={f} autoComplete="email" /></label>
            <label className="block text-sm font-semibold">I am a…<select name="topic" className={f}><option>Student</option><option>Employer</option><option>College</option><option>Mentor</option><option>Press</option></select></label>
            <label className="block text-sm font-semibold">Message<textarea required name="message" rows={5} className={f} /></label>
            <Button type="submit" size="lg">Send message</Button>
          </form>
        </div>
      </Block>
    </>
  );
}
