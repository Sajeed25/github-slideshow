import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "@/components/pages/auth-card";

export const metadata: Metadata = { title: "Join Kalwings", robots: { index: false } };
export default function Page() { return <Suspense><AuthCard mode="join" /></Suspense>; }
