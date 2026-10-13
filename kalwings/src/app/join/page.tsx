import type { Metadata } from "next";
import { AuthCard } from "@/components/pages/auth-card";

export const metadata: Metadata = { title: "Join Kalwings", robots: { index: false } };
export default function Page() { return <AuthCard mode="join" />; }
