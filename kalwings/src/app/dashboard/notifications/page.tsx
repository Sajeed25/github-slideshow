import { db } from "@/lib/db";
import { requirePageRole } from "@/lib/session";
import { ActionButton } from "@/components/dash/action-form";
import { Empty, PageTitle, Panel, fmtTime } from "@/components/dash/ui";
import { markNotificationsRead } from "@/app/actions/student";

export default async function Page() {
  const u = await requirePageRole();
  const items = await db.notification.findMany({ where: { userId: u.id }, orderBy: { createdAt: "desc" }, take: 50 });
  return (
    <>
      <PageTitle title="Notifications" />
      <Panel action={items.some((n) => !n.readAt) ? <ActionButton action={markNotificationsRead}>Mark all read</ActionButton> : undefined}>
        {items.length ? <ul className="divide-y divide-line">{items.map((n) => <li key={n.id} className="py-3"><p className={n.readAt ? "" : "font-semibold"}>{n.title}</p>{n.body && <p className="text-sm text-ink-soft">{n.body}</p>}<p className="text-xs text-ink-soft">{fmtTime(n.createdAt)}</p></li>)}</ul> : <Empty>You&apos;re all caught up.</Empty>}
      </Panel>
    </>
  );
}
