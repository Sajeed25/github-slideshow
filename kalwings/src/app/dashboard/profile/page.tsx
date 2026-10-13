import { db } from "@/lib/db";
import { requirePageRole } from "@/lib/session";
import { ActionForm, Area, Field, ActionButton } from "@/components/dash/action-form";
import { PageTitle, Panel } from "@/components/dash/ui";
import { saveProfile, toggleContactVisible } from "@/app/actions/student";

export default async function Page() {
  const u = await requirePageRole("STUDENT");
  const p = await db.studentProfile.findUniqueOrThrow({ where: { userId: u.id } });
  return (
    <>
      <PageTitle title="Profile" />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Panel>
          <ActionForm action={saveProfile}>
            <Field label="Full name" name="name" defaultValue={u.name} required />
            <Field label="Headline" name="headline" defaultValue={p.headline ?? ""} required />
            <div className="grid gap-4 sm:grid-cols-2"><Field label="Graduation year" name="graduationYear" type="number" defaultValue={p.graduationYear ?? ""} required /><Field label="City" name="city" defaultValue={p.city ?? ""} /></div>
            <Field label="Skills (comma-separated)" name="skills" defaultValue={p.skillsClaimed.join(", ")} hint="Self-declared. Verified badges come only from evidence." />
            <Area label="Bio" name="bio" defaultValue={p.bio ?? ""} />
            <Field label="GitHub" name="githubUrl" type="url" defaultValue={p.githubUrl ?? ""} />
            <Field label="Looking for" name="lookingFor" defaultValue={p.lookingFor ?? ""} />
          </ActionForm>
        </Panel>
        <Panel title="Privacy">
          <p className="text-sm text-ink-soft">Your email and phone are <b>private by default</b>. Employers only see them if you opt in below.</p>
          <p className="mt-4 text-sm">Contact details: <b>{p.contactVisible ? "visible to verified employers you apply to" : "hidden"}</b></p>
          <div className="mt-3"><ActionButton action={toggleContactVisible}>{p.contactVisible ? "Hide my contact details" : "Share with employers I apply to"}</ActionButton></div>
        </Panel>
      </div>
    </>
  );
}
