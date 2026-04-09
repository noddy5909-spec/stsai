"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { PrivacyFooter } from "./PrivacyFooter";

const NAVY = "#003876";

const primaryNavItems = [
  { href: "/hmt-apply", label: "학맞통 신청" },
  { href: "/dashboard", label: "관리 학생 명단" },
  { href: "/exchange", label: "통합지원신청" },
  { href: "/forms", label: "서식 모음" },
] as const;

export function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/landing";
  const isLogin = pathname === "/login";
  const isPublicPage = isLanding || isLogin;
  const isDashboard = pathname === "/dashboard";
  const shouldRunSessionTimer = !isPublicPage && isDashboard;
  const [remainingSec, setRemainingSec] = useState<number | null>(null);

  useEffect(() => {
    if (!shouldRunSessionTimer) return;
    const key = "hmt_mock_session_expires_at";
    const read = () => {
      const raw = window.localStorage.getItem(key);
      if (!raw) {
        setRemainingSec(null);
        return;
      }
      const expiresAt = Number(raw);
      if (!Number.isFinite(expiresAt)) {
        setRemainingSec(null);
        return;
      }
      const diff = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      if (diff <= 0) {
        window.localStorage.removeItem(key);
        setRemainingSec(0);
        return;
      }
      setRemainingSec(diff);
    };
    read();
    const id = window.setInterval(read, 1000);
    return () => window.clearInterval(id);
  }, [shouldRunSessionTimer]);

  const timerLabel = useMemo(() => {
    if (remainingSec === null) return null;
    const mm = String(Math.floor(remainingSec / 60)).padStart(2, "0");
    const ss = String(remainingSec % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  }, [remainingSec]);

  if (isPublicPage) {
    return (
      <div className="min-h-screen bg-white text-slate-800">{children}</div>
    );
  }

  const isHmtApply =
    pathname === "/hmt-apply" || pathname.startsWith("/hmt-apply/");
  const isApplyFlow = pathname === "/exchange" || pathname.startsWith("/exchange/");
  const isForms = pathname === "/forms" || pathname.startsWith("/forms/");

  const mainVerticalPad =
    pathname === "/exchange" ? "pb-6 pt-0" : "py-6";

  return (
    <div className="flex min-h-screen flex-col bg-portal-surface text-slate-800">
      <header className="sticky top-0 z-10 shadow-md" style={{ backgroundColor: NAVY }}>
        <div className="flex w-full flex-wrap items-center justify-between gap-3 border-b border-white/15 px-4 py-3 sm:px-6">
          <Link href="/landing" className="leading-tight text-white hover:opacity-90">
            <p className="text-sm font-bold tracking-tight">학맞통 EASY</p>
            <p className="text-xs text-white/80">학생맞춤통합지원</p>
          </Link>
          <p className="max-w-md text-xs leading-relaxed text-white/75">
            입력·표시 데이터는 이 브라우저에서만 처리되는 프로토타입입니다.
          </p>
          {isDashboard && timerLabel && (
            <div className="flex items-center gap-2 rounded border border-white/30 bg-white/10 px-2.5 py-1 text-xs text-white">
              <span className="tabular-nums">{timerLabel}</span>
              <button
                type="button"
                onClick={() => {
                  const next = Date.now() + 30 * 60 * 1000;
                  window.localStorage.setItem("hmt_mock_session_expires_at", String(next));
                  setRemainingSec(30 * 60);
                }}
                className="rounded border border-white/40 px-1.5 py-0.5 text-[11px] hover:bg-white/15"
              >
                연장
              </button>
            </div>
          )}
        </div>

        <nav className="px-4 sm:px-6" aria-label="주 메뉴">
          <div className="-mb-px flex w-full items-center gap-1 overflow-x-auto">
            {primaryNavItems.map((item) => {
              const active =
                item.href === "/hmt-apply"
                  ? isHmtApply
                  : item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : item.href === "/exchange"
                      ? isApplyFlow
                      : item.href === "/forms"
                        ? isForms
                        : false;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`shrink-0 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "border-white text-white"
                      : "border-transparent text-white/85 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

      </header>

      <main
        className={`flex w-full flex-1 flex-col px-4 sm:px-6 ${mainVerticalPad}`}
      >
        {children}
      </main>

      <PrivacyFooter />
    </div>
  );
}
