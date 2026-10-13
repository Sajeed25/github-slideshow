import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DraftNotice } from "@/components/pages/shell";
import { Logo } from "@/components/ui/wing";

const f = "mt-1.5 h-12 w-full rounded-xl border border-line bg-surface px-3.5 text-[15px]";

export function AuthCard({ mode }: { mode: "join" | "login" }) {
  const join = mode === "join";
  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-16">
      <div className="card w-full max-w-md p-8">
        <Logo />
        <h1 className="mt-6 text-3xl font-extrabold">{join ? "Join Kalwings" : "Welcome back"}</h1>
        <p className="mt-1 text-ink-soft">{join ? "Free for students. Always." : "Log in with your email or phone."}</p>
        <div className="mt-5"><DraftNotice>Auth is not connected yet. Wire email/phone OTP + Google (see README → Platform roadmap).</DraftNotice></div>
        <form className="mt-6 space-y-4" aria-label={join ? "Join" : "Log in"}>
          {join && (
            <label className="block text-sm font-semibold">I am a…
              <select className={f} name="role"><option value="student">Student</option><option value="mentor">Mentor</option><option value="employer">Employer</option><option value="college_admin">College admin</option></select>
            </label>
          )}
          <label className="block text-sm font-semibold">Email or phone<input className={f} name="identifier" autoComplete="username" /></label>
          <Button type="button" size="lg" className="w-full" disabled>Send one-time code</Button>
          <Button type="button" size="lg" variant="secondary" className="w-full" disabled>Continue with Google</Button>
        </form>
        <p className="mt-6 text-center text-sm text-ink-soft">{join ? <>Already a member? <Link className="font-semibold text-ink underline" href="/login">Log in</Link></> : <>New here? <Link className="font-semibold text-ink underline" href="/join">Join Kalwings</Link></>}</p>
      </div>
    </div>
  );
}
