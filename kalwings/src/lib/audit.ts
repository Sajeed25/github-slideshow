import "server-only";
import { db } from "@/lib/db";

export const audit = (actorId: string, action: string, target: string) => db.auditLog.create({ data: { actorId, action, target } });
export const notify = (userId: string, title: string, body?: string) => db.notification.create({ data: { userId, title, body } });
