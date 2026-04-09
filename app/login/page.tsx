"use client";

import { BadgeCheck, Loader2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const DEEP_BLUE = "#1e3a8a";

type ToastState = {
  type: "success" | "info";
  message: string;
} | null;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [toast, setToast] = useState<ToastState>(null);

  async function mockCertificateLogin() {
    if (loading) return;
    setLoading(true);
    setLoadingText("인증서를 읽어오는 중입니다...");
    await new Promise((resolve) => window.setTimeout(resolve, 1500));
    window.localStorage.setItem(
      "hmt_mock_session_expires_at",
      String(Date.now() + 30 * 60 * 1000),
    );
    setToast({
      type: "success",
      message: "인증 성공! 김OO 선생님(OO초등학교) 환영합니다.",
    });
    window.setTimeout(() => {
      router.push("/dashboard");
    }, 900);
  }

  function mockOnepassLogin() {
    if (loading) return;
    setToast({ type: "info", message: "디지털원패스 로그인(목업) 준비 중입니다." });
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center px-4 py-10 sm:px-6">
        <section className="w-full border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <p className="text-xs font-medium tracking-wide text-slate-500">
              학맞통 EASY · 보안 로그인
            </p>
            <h1 className="mt-1 text-2xl font-bold" style={{ color: DEEP_BLUE }}>
              교직원 인증 로그인
            </h1>
          </div>

          <div className="space-y-5 px-6 py-6">
            <button
              type="button"
              onClick={mockCertificateLogin}
              disabled={loading}
              className="flex h-14 w-full items-center justify-center gap-2 border border-[#1e3a8a] bg-[#1e3a8a] text-base font-semibold text-white transition-colors hover:bg-[#1a3278] disabled:cursor-not-allowed disabled:opacity-80"
            >
              {loading ? (
                <Loader2 className="size-5 animate-spin" aria-hidden />
              ) : (
                <ShieldCheck className="size-5" aria-hidden />
              )}
              <span>
                {loading ? loadingText : "EPKI / GPKI 인증서 로그인"}
              </span>
            </button>

            <button
              type="button"
              onClick={mockOnepassLogin}
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 border border-slate-300 bg-white text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              디지털원패스 로그인
            </button>

            <div className="space-y-2 border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-sm text-slate-700">
                본 시스템은 교육청 보안 가이드라인을 준수하며, 인가된 교직원만 접속 가능합니다.
              </p>
              <div className="inline-flex items-center gap-1.5 border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                <BadgeCheck className="size-3.5" aria-hidden />
                현재 접속 환경: 교내 망(Private Network) 인증됨
              </div>
            </div>
          </div>
        </section>
      </div>

      {toast && (
        <div
          className={`fixed right-4 bottom-4 z-50 max-w-sm border px-4 py-3 text-sm shadow-md ${
            toast.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-slate-200 bg-white text-slate-700"
          }`}
          role="status"
          aria-live="polite"
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
