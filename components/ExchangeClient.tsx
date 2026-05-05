"use client";

import { Check, ChevronDown, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ANALYZE_STUDENT_API_URL,
  buildAnalyzeStudentPayload,
  parseAnalyzeStudentResponse,
  type StudentAnalyzeRecommendation,
  type StudentAnalyzeResult,
} from "@/lib/analyze-student-payload";
import {
  managedStudentSummaryLine,
  managedStudents,
  type ManagedStudent,
} from "@/lib/mock-data";

const REC_PAGE_SIZE = 10;

/** 핵심신호 배지 — 「학업 부진」과 동일한 파란 톤으로 통일 */
const SIGNAL_BADGE_CLASS =
  "rounded-full border border-blue-200/80 bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800";

/** 적합도(0–100) — 배지 줄 높이에 맞춘 작은 원형 그래프 */
function SuitabilityMiniDonut({ value }: { value: number }) {
  const pct = Math.min(100, Math.max(0, value));
  const size = 18;
  const stroke = 2;
  const r = size / 2 - stroke / 2 - 0.25;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  const cx = size / 2;
  const cy = size / 2;
  return (
    <div
      className="relative inline-flex size-[18px] shrink-0 items-center justify-center"
      title={`적합도 ${pct}%`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden
      >
        <circle cx={cx} cy={cy} r={r} fill="none" className="stroke-slate-200" strokeWidth={stroke} />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          className="stroke-[#003876]"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
        />
      </svg>
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-[6.5px] font-semibold tabular-nums leading-none text-slate-800">
        {pct}
      </span>
    </div>
  );
}

/**
 * 분류 배지 색 — 먼저 `category`(분류)로 판별해 제도가 `welfareType`의 「기관」
 * 등과 섞여 초록으로 나가지 않게 함. `category`에 키워드가 없을 때만 `welfareType` 보조.
 */
function recommendationCategoryBadgeClass(rec: StudentAnalyzeRecommendation): string {
  const cat = rec.category ?? "";
  if (cat.includes("기관")) {
    return "bg-emerald-100 text-emerald-900";
  }
  if (cat.includes("제도")) {
    return "bg-violet-100 text-violet-900";
  }
  const wt = rec.welfareType ?? "";
  if (wt.includes("기관")) {
    return "bg-emerald-100 text-emerald-900";
  }
  if (wt.includes("제도")) {
    return "bg-violet-100 text-violet-900";
  }
  return "bg-slate-100 text-slate-800";
}

function statusTextClass(status: ManagedStudent["status"]) {
  switch (status) {
    case "지원중":
      return "text-slate-800";
    case "관찰":
      return "text-slate-700";
    case "종결예정":
      return "text-slate-500";
    default:
      return "text-slate-600";
  }
}

export function ExchangeClient() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [listOpen, setListOpen] = useState(false);
  const [screenMode, setScreenMode] = useState<"idle" | "apply">("idle");
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyApiError, setApplyApiError] = useState<string | null>(null);
  const [apiApplyData, setApiApplyData] = useState<StudentAnalyzeResult | null>(null);
  const [recPageIndex, setRecPageIndex] = useState(0);
  const [applyCtaPhase, setApplyCtaPhase] = useState<"idle" | "submitting" | "done">("idle");
  const applyCtaTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const selectedStudent = useMemo(
    () => managedStudents.find((s) => s.id === selectedId) ?? null,
    [selectedId],
  );

  const recommendations = apiApplyData?.ai_추천기관_제도 ?? [];
  const aiSummary = apiApplyData?.ai_분석정리_요약;

  const recTotal = recommendations.length;
  const recTotalPages = recTotal === 0 ? 0 : Math.ceil(recTotal / REC_PAGE_SIZE);
  const safeRecPageIndex =
    recTotalPages === 0 ? 0 : Math.min(recPageIndex, Math.max(0, recTotalPages - 1));
  const recPageStart = safeRecPageIndex * REC_PAGE_SIZE;
  const recommendationsPage = useMemo(
    () => recommendations.slice(recPageStart, recPageStart + REC_PAGE_SIZE),
    [recommendations, recPageStart],
  );

  useEffect(() => {
    setRecPageIndex(0);
  }, [apiApplyData]);

  useEffect(() => {
    if (recTotalPages === 0) return;
    setRecPageIndex((i) => Math.min(i, recTotalPages - 1));
  }, [recTotalPages]);

  useEffect(() => {
    setApiApplyData(null);
    setApplyApiError(null);
    setApplyCtaPhase("idle");
    if (applyCtaTimerRef.current) {
      clearTimeout(applyCtaTimerRef.current);
      applyCtaTimerRef.current = null;
    }
  }, [selectedId]);

  useEffect(() => {
    return () => {
      if (applyCtaTimerRef.current) {
        clearTimeout(applyCtaTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!listOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setListOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [listOpen]);

  async function handleIntegratedApply() {
    if (!selectedStudent) return;
    setApplyCtaPhase("submitting");
    if (applyCtaTimerRef.current) {
      clearTimeout(applyCtaTimerRef.current);
      applyCtaTimerRef.current = null;
    }
    applyCtaTimerRef.current = setTimeout(() => {
      setApplyCtaPhase("done");
      applyCtaTimerRef.current = null;
    }, 1000);

    setApplyApiError(null);
    setApiApplyData(null);
    setApplyLoading(true);
    try {
      const body = buildAnalyzeStudentPayload(selectedStudent.id);
      const requestJson = JSON.stringify(body);
      console.log("[통합 검색] 요청 JSON (본문 문자열)\n", requestJson);
      const res = await fetch(ANALYZE_STUDENT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: requestJson,
      });
      const text = await res.text();
      let json: unknown;
      try {
        json = text ? JSON.parse(text) : null;
      } catch {
        json = null;
      }
      if (!res.ok) {
        if (applyCtaTimerRef.current) {
          clearTimeout(applyCtaTimerRef.current);
          applyCtaTimerRef.current = null;
        }
        setApplyCtaPhase("idle");
        setApplyApiError(
          typeof json === "object" && json && "message" in json
            ? String((json as { message: unknown }).message)
            : `요청 실패 (${res.status})`,
        );
        setApiApplyData(null);
      } else {
        const parsed = parseAnalyzeStudentResponse(json);
        if (parsed) {
          setApiApplyData(parsed);
        } else {
          if (applyCtaTimerRef.current) {
            clearTimeout(applyCtaTimerRef.current);
            applyCtaTimerRef.current = null;
          }
          setApplyCtaPhase("idle");
          setApiApplyData(null);
          setApplyApiError(
            "API 응답 형식이 올바르지 않습니다. ai_분석정리_요약·ai_추천기관_제도 구조를 확인해 주세요.",
          );
        }
      }
    } catch (e) {
      if (applyCtaTimerRef.current) {
        clearTimeout(applyCtaTimerRef.current);
        applyCtaTimerRef.current = null;
      }
      setApplyCtaPhase("idle");
      setApiApplyData(null);
      setApplyApiError(e instanceof Error ? e.message : "요청 처리 오류");
    } finally {
      setApplyLoading(false);
      setScreenMode("apply");
    }
  }

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-3">
        <h1 className="text-xl font-bold leading-tight text-[#003876]">지원 통합 검색</h1>

        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-stretch">
          <div ref={rootRef} className="relative min-w-0 flex-1">
            <button
              type="button"
              id="exchange-student-trigger"
              aria-haspopup="listbox"
              aria-expanded={listOpen}
              aria-label="학생 명단 선택"
              onClick={() => setListOpen((o) => !o)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setListOpen(false);
              }}
              className="flex h-[58px] w-full items-center gap-2 border border-slate-200 bg-white px-3 py-2 text-left text-sm outline-none transition-colors hover:border-slate-300 focus-visible:ring-2 focus-visible:ring-[#003876]/45"
            >
              <span className="min-w-0 flex-1">
                {selectedStudent ? (
                  <>
                    <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
                      <span className="font-semibold text-slate-900">{selectedStudent.name}</span>
                      <span
                        className={`text-xs font-medium ${statusTextClass(selectedStudent.status)}`}
                      >
                        {selectedStudent.status}
                      </span>
                    </span>
                    <span className="mt-0.5 block truncate text-xs leading-snug text-slate-600">
                      {managedStudentSummaryLine(selectedStudent)}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="block font-semibold text-slate-500">학생을 선택하세요…</span>
                    <span className="mt-0.5 block truncate text-xs leading-snug text-slate-400">
                      관리 학생 명단과 동일한 목록입니다.
                    </span>
                  </>
                )}
              </span>
              <ChevronDown
                className={`mt-0.5 size-4 shrink-0 text-slate-500 transition-transform ${listOpen ? "rotate-180" : ""}`}
                aria-hidden
              />
            </button>

            {listOpen ? (
              <ul
                role="listbox"
                aria-label="학생 명단"
                className="absolute left-0 right-0 z-50 mt-1 max-h-72 overflow-auto border border-slate-200 bg-white py-1 shadow-lg"
              >
                {managedStudents.map((s) => {
                  const isSelected = selectedId === s.id;
                  return (
                    <li key={s.id} role="presentation">
                      <button
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          setSelectedId(s.id);
                          setListOpen(false);
                          setScreenMode("idle");
                        }}
                        className={`flex w-full flex-col items-stretch gap-0.5 px-3 py-2 text-left text-sm transition-colors ${
                          isSelected ? "bg-[#f0f4fa] text-slate-900" : "hover:bg-slate-50"
                        }`}
                      >
                        <span className="font-semibold text-slate-900">{s.name}</span>
                        <span className="break-words text-xs leading-snug text-slate-600">
                          {managedStudentSummaryLine(s)}
                        </span>
                        <span className={`text-xs font-medium ${statusTextClass(s.status)}`}>
                          상태 · {s.status}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => void handleIntegratedApply()}
            disabled={
              !selectedStudent || applyLoading || applyCtaPhase === "submitting"
            }
            className="inline-flex h-[58px] min-w-[8.5rem] shrink-0 items-center justify-center gap-2 border border-[#003876] bg-[#003876] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#002d5c] disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-200 disabled:text-slate-500"
          >
            {applyCtaPhase === "submitting" ? (
              "신청 중…"
            ) : applyCtaPhase === "done" ? (
              <>
                <Check className="size-4 shrink-0" strokeWidth={2.5} aria-hidden />
                신청 완료
              </>
            ) : applyLoading ? (
              "요청 중…"
            ) : (
              "통합 검색"
            )}
          </button>
        </div>
      </div>

      <div className="w-full min-w-0">
        {selectedStudent ? (
          screenMode === "apply" ? (
            <div className="space-y-4 font-light" aria-live="polite">
              {applyApiError ? (
                <p
                  role="alert"
                  className="rounded-sm border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
                >
                  분석 API: {applyApiError}
                </p>
              ) : null}
              {apiApplyData ? (
                <>
                  <section
                    className="overflow-hidden border border-slate-300/80 bg-white"
                    aria-label="AI 분석 정리 요약"
                  >
                    <div className="border-b border-slate-100 bg-slate-50/90 px-5 py-2">
                      <h2 className="text-sm font-semibold tracking-tight text-slate-900">
                        분석 요약
                      </h2>
                      <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                        요약 분석과 핵심 신호를 확인할 수 있습니다.
                      </p>
                    </div>

                    <div className="space-y-3 px-5 py-3">
                      <div>
                        <p className="text-sm font-normal leading-relaxed text-slate-800">
                          {aiSummary?.요약분석}
                        </p>
                      </div>
                      <div>
                        <ul className="flex flex-wrap gap-2" aria-label="핵심신호 목록">
                          {(aiSummary?.핵심신호 ?? []).map((signal) => (
                            <li key={signal} className={SIGNAL_BADGE_CLASS}>
                              {signal}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </section>

                  <section
                    className="overflow-hidden border border-slate-300/80 bg-white"
                    aria-label="AI 추천 제도 및 기관"
                  >
                    <div className="border-b border-slate-100 bg-slate-50/90 px-5 py-3">
                      <h2 className="text-sm font-semibold tracking-tight text-slate-900">
                        추천 제도·기관
                      </h2>
                      <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                        분석 결과로 제시된 복지 제도·기관 정보입니다. 한 페이지에 {REC_PAGE_SIZE}건씩
                        표시됩니다.
                      </p>
                    </div>

                    <ul className="space-y-4 px-5 pb-2 pt-5">
                      {recommendationsPage.map((rec: StudentAnalyzeRecommendation, index: number) => {
                        const globalIndex = recPageStart + index;
                        const recKey = `${rec.servId || "no-id"}-${globalIndex}`;
                        return (
                          <li
                            key={recKey}
                            className="rounded-lg border border-slate-200 bg-slate-50/40 p-4 shadow-sm"
                          >
                            <p className="text-[10px] font-medium text-slate-400">
                              항목 {globalIndex + 1} / {recTotal}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <span
                                className={`rounded px-2 py-0.5 text-[11px] font-semibold ${recommendationCategoryBadgeClass(rec)}`}
                              >
                                분류: {rec.category}
                              </span>
                              <span className="rounded bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700 ring-1 ring-slate-200">
                                복지 유형: {rec.welfareType || "—"}
                              </span>
                              {rec.suitability != null ? (
                                <span className="inline-flex items-center gap-1.5 rounded bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700 ring-1 ring-slate-200">
                                  <span className="font-semibold text-slate-600">적합도</span>
                                  <SuitabilityMiniDonut value={rec.suitability} />
                                  <span className="sr-only">적합도 {rec.suitability}%</span>
                                </span>
                              ) : (
                                <span className="rounded bg-slate-200 px-2 py-0.5 text-[11px] text-slate-600">
                                  적합도: —
                                </span>
                              )}
                            </div>
                            <p className="mt-2.5 text-base font-semibold leading-snug text-slate-900">
                              {rec.servNm}
                            </p>

                            <dl className="mt-4 space-y-3 text-sm text-slate-800">
                              <div className="grid gap-1 sm:grid-cols-[minmax(7.5rem,11rem)_1fr] sm:items-start sm:gap-x-4">
                                <dt className="text-[11px] font-semibold text-slate-500">소관 부처</dt>
                                <dd>{rec.agency || "—"}</dd>
                              </div>
                              <div className="grid gap-1 sm:grid-cols-[minmax(7.5rem,11rem)_1fr] sm:items-start sm:gap-x-4">
                                <dt className="text-[11px] font-semibold text-slate-500">담당 부서</dt>
                                <dd className="leading-relaxed">{rec.department || "—"}</dd>
                              </div>
                              <div className="grid gap-1.5 sm:grid-cols-[minmax(7.5rem,11rem)_1fr] sm:items-start sm:gap-x-4">
                                <dt className="pt-0.5 text-[11px] font-semibold text-slate-500">
                                  지원 분야
                                </dt>
                                <dd>
                                  {rec.intrsThemaArray.length ? (
                                    <ul className="flex flex-wrap gap-1.5">
                                      {rec.intrsThemaArray.map((t) => (
                                        <li
                                          key={t}
                                          className="rounded-md bg-white px-2 py-0.5 text-xs text-slate-700 ring-1 ring-slate-200"
                                        >
                                          {t}
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    "—"
                                  )}
                                </dd>
                              </div>
                              <div className="grid gap-1.5 sm:grid-cols-[minmax(7.5rem,11rem)_1fr] sm:items-start sm:gap-x-4">
                                <dt className="pt-0.5 text-[11px] font-semibold text-slate-500">
                                  대상 연령
                                </dt>
                                <dd>
                                  {rec.lifeArray.length ? (
                                    <ul className="flex flex-wrap gap-1.5">
                                      {rec.lifeArray.map((t) => (
                                        <li
                                          key={t}
                                          className="rounded-md bg-amber-50 px-2 py-0.5 text-xs text-amber-950 ring-1 ring-amber-200/80"
                                        >
                                          {t}
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    "—"
                                  )}
                                </dd>
                              </div>
                              <div className="grid gap-1 sm:grid-cols-[minmax(7.5rem,11rem)_1fr] sm:items-start sm:gap-x-4">
                                <dt className="text-[11px] font-semibold text-slate-500">지원 형태</dt>
                                <dd>{rec.srvPvsnNm || "—"}</dd>
                              </div>
                              <div className="grid gap-1 sm:grid-cols-[minmax(7.5rem,11rem)_1fr] sm:items-start sm:gap-x-4">
                                <dt className="text-[11px] font-semibold text-slate-500">지원 주기</dt>
                                <dd>{rec.sprtCycNm || "—"}</dd>
                              </div>
                              <div className="grid gap-1 sm:grid-cols-[minmax(7.5rem,11rem)_1fr] sm:items-start sm:gap-x-4">
                                <dt className="text-[11px] font-semibold text-slate-500">지원 내용</dt>
                                <dd className="font-normal leading-relaxed text-slate-700">
                                  {rec.servDgst || "—"}
                                </dd>
                              </div>
                              <div className="grid gap-1 sm:grid-cols-[minmax(7.5rem,11rem)_1fr] sm:items-start sm:gap-x-4">
                                <dt className="text-[11px] font-semibold text-slate-500">필요 서류</dt>
                                <dd className="font-normal leading-relaxed text-slate-700">
                                  제도·기관별로 상이하며, 신청 단계에서 별도 안내 예정입니다.
                                </dd>
                              </div>
                              <div className="grid gap-1 sm:grid-cols-[minmax(7.5rem,11rem)_1fr] sm:items-start sm:gap-x-4">
                                <dt className="text-[11px] font-semibold text-slate-500">
                                  상세 정보 링크
                                </dt>
                                <dd className="min-w-0 break-all">
                                  {rec.servDtlLink ? (
                                    <a
                                      href={rec.servDtlLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[#003876] underline underline-offset-2 hover:text-[#002d5c]"
                                    >
                                      {rec.servDtlLink}
                                    </a>
                                  ) : (
                                    "—"
                                  )}
                                </dd>
                              </div>
                              <div className="grid gap-1 sm:grid-cols-[minmax(7.5rem,11rem)_1fr] sm:items-start sm:gap-x-4">
                                <dt className="text-[11px] font-semibold text-slate-500">문의처</dt>
                                <dd className="flex flex-wrap items-center justify-between gap-3">
                                  <span className="min-w-0 break-all font-normal">
                                    {rec.contact === null ? (
                                      <span className="text-slate-400">null</span>
                                    ) : rec.contact === "" ? (
                                      "—"
                                    ) : (
                                      rec.contact
                                    )}
                                  </span>
                                  {rec.servDtlLink ? (
                                    <a
                                      href={rec.servDtlLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex min-w-28 items-center justify-center rounded border border-[#003876] bg-[#003876] px-6 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#002d5c]"
                                    >
                                      신청하기
                                    </a>
                                  ) : (
                                    <button
                                      type="button"
                                      disabled
                                      className="inline-flex min-w-28 items-center justify-center rounded border border-slate-300 bg-slate-200 px-6 py-2 text-xs font-semibold text-slate-500"
                                    >
                                      신청하기
                                    </button>
                                  )}
                                </dd>
                              </div>
                            </dl>
                          </li>
                        );
                      })}
                    </ul>

                    {recTotalPages > 1 ? (
                      <nav
                        className="flex flex-col items-stretch gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                        aria-label="추천 제도·기관 페이지"
                      >
                        <p className="text-center text-[11px] text-slate-500 sm:text-left">
                          {safeRecPageIndex + 1} / {recTotalPages} 페이지 · 전체 {recTotal}건
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:justify-end">
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                            disabled={safeRecPageIndex <= 0}
                            aria-label="이전 페이지"
                            onClick={() => setRecPageIndex((p) => Math.max(0, p - 1))}
                          >
                            <ChevronLeft className="size-4" aria-hidden />
                            이전
                          </button>
                          <div className="flex flex-wrap items-center justify-center gap-1">
                            {Array.from({ length: recTotalPages }, (_, i) => {
                              const pageNum = i + 1;
                              const isActive = i === safeRecPageIndex;
                              return (
                                <button
                                  key={pageNum}
                                  type="button"
                                  className={`min-w-8 rounded px-2 py-1.5 text-xs font-semibold transition-colors ${
                                    isActive
                                      ? "bg-[#003876] text-white"
                                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                  }`}
                                  aria-label={`${pageNum}페이지`}
                                  aria-current={isActive ? "page" : undefined}
                                  onClick={() => setRecPageIndex(i)}
                                >
                                  {pageNum}
                                </button>
                              );
                            })}
                          </div>
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                            disabled={safeRecPageIndex >= recTotalPages - 1}
                            aria-label="다음 페이지"
                            onClick={() =>
                              setRecPageIndex((p) => Math.min(recTotalPages - 1, p + 1))
                            }
                          >
                            다음
                            <ChevronRight className="size-4" aria-hidden />
                          </button>
                        </div>
                      </nav>
                    ) : null}
                    <div className="border-t border-slate-100 px-5 py-3 text-right">
                      <p className="text-[10px] text-gray-400">
                        Source: 복지로 오픈 API 및 나이스 교육정보 개방포털 기반
                      </p>
                      <p className="mt-0.5 text-[10px] text-gray-400">데이터 기준일: 2026.04.27</p>
                    </div>
                  </section>
                </>
              ) : !applyApiError ? (
                <p className="rounded-sm border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  표시할 분석 결과가 없습니다. 통합 검색을 다시 시도해 주세요.
                </p>
              ) : null}
            </div>
          ) : (
            <section
              className="flex min-h-[min(360px,50vh)] flex-col items-center justify-center border border-dashed border-slate-200 bg-slate-50/40 px-6 py-12 text-center"
              aria-label="통합 검색 안내"
            >
              <p className="mt-4 text-sm font-medium text-slate-600">
                학생을 선택한 뒤 우측 통합 검색을 눌러주세요.
              </p>
              <p className="mt-1.5 max-w-sm text-xs text-slate-500">
                요청 본문은 대시보드 관리 학생과 동일한 통합신청서·관찰 일지(목업)에서 가져옵니다.
              </p>
            </section>
          )
        ) : (
          <section
            className="flex min-h-[min(360px,50vh)] flex-col items-center justify-center border border-dashed border-slate-200 bg-slate-50/40 px-6 py-12 text-center"
            aria-label="추천 안내"
          >
            <p className="mt-4 text-sm font-medium text-slate-600">
              위 목록에서 학생을 선택한 뒤 통합 검색을 눌러주세요.
            </p>
            <p className="mt-1.5 max-w-sm text-xs text-slate-500">
              명단은 대시보드「관리 학생 명단」과 동일한 데이터입니다.
            </p>
          </section>
        )}
      </div>

      {applyLoading ? (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-[2px]"
          role="status"
          aria-live="polite"
          aria-busy="true"
          aria-labelledby="exchange-loading-title"
        >
          <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white px-8 py-10 shadow-xl">
            <Loader2
              className="mx-auto size-11 animate-spin text-[#003876]"
              strokeWidth={2}
              aria-hidden
            />
            <p
              id="exchange-loading-title"
              className="mt-5 text-center text-base font-semibold text-slate-900"
            >
              통합 검색 중
            </p>
            <p className="mt-2 text-center text-sm leading-relaxed text-slate-600">
              서버에서 학생 정보를 분석하고 있습니다.
              <br />
              잠시만 기다려 주세요…
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
