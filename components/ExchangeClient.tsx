"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ANALYZE_STUDENT_API_URL,
  buildAnalyzeStudentPayload,
  parseAnalyzeStudentResponse,
  type StudentAnalyzeRecommendation,
  type StudentAnalyzeResult,
} from "@/lib/analyze-student-payload";
import { managedStudents, type ManagedStudent } from "@/lib/mock-data";

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

function studentSummaryLine(s: ManagedStudent) {
  return `${s.gradeClass} · ${s.caseRef} · ${s.supportArea} · 최근 갱신 ${s.lastUpdated}`;
}

export function ExchangeClient() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [listOpen, setListOpen] = useState(false);
  const [screenMode, setScreenMode] = useState<"idle" | "apply">("idle");
  const [openRecommendationKey, setOpenRecommendationKey] = useState<string | null>(null);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyApiError, setApplyApiError] = useState<string | null>(null);
  const [apiApplyData, setApiApplyData] = useState<StudentAnalyzeResult | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const selectedStudent = useMemo(
    () => managedStudents.find((s) => s.id === selectedId) ?? null,
    [selectedId],
  );

  const recommendations = apiApplyData?.ai_추천기관_제도 ?? [];
  const aiSummary = apiApplyData?.ai_분석정리_요약;

  useEffect(() => {
    setApiApplyData(null);
    setApplyApiError(null);
  }, [selectedId]);

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
    setOpenRecommendationKey(null);
    setApplyApiError(null);
    setApplyLoading(true);
    try {
      const body = buildAnalyzeStudentPayload(selectedStudent.id);
      const res = await fetch(ANALYZE_STUDENT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const text = await res.text();
      let json: unknown;
      try {
        json = text ? JSON.parse(text) : null;
      } catch {
        json = null;
      }
      if (!res.ok) {
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
          setApiApplyData(null);
          setApplyApiError(
            "API 응답 형식이 올바르지 않습니다. ai_분석정리_요약·ai_추천기관_제도 구조를 확인해 주세요.",
          );
        }
      }
    } catch (e) {
      setApiApplyData(null);
      setApplyApiError(e instanceof Error ? e.message : "네트워크 오류");
    } finally {
      setApplyLoading(false);
      setScreenMode("apply");
    }
  }

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-3">
        <h1 className="text-xl font-bold leading-tight text-[#003876]">
          통합지원신청
        </h1>

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
                      <span className="font-semibold text-slate-900">
                        {selectedStudent.name}
                      </span>
                      <span
                        className={`text-xs font-medium ${statusTextClass(selectedStudent.status)}`}
                      >
                        {selectedStudent.status}
                      </span>
                    </span>
                    <span className="mt-0.5 block truncate text-xs leading-snug text-slate-600">
                      {studentSummaryLine(selectedStudent)}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="block font-semibold text-slate-500">
                      학생을 선택하세요…
                    </span>
                    <span className="mt-0.5 block truncate text-xs leading-snug text-slate-400">
                      선택 후 학생 정보가 표시됩니다.
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
                          isSelected
                            ? "bg-[#f0f4fa] text-slate-900"
                            : "hover:bg-slate-50"
                        }`}
                      >
                        <span className="font-semibold text-slate-900">
                          {s.name}
                        </span>
                        <span className="break-words text-xs leading-snug text-slate-600">
                          {studentSummaryLine(s)}
                        </span>
                        <span
                          className={`text-xs font-medium ${statusTextClass(s.status)}`}
                        >
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
            disabled={!selectedStudent || applyLoading}
            className="h-[58px] shrink-0 border border-[#003876] bg-[#003876] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#002d5c] disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-200 disabled:text-slate-500"
          >
            {applyLoading ? "요청 중…" : "통합 신청"}
          </button>
        </div>
      </div>

      <div className="w-full min-w-0">
        {selectedStudent ? (
          screenMode === "apply" ? (
            <div className="space-y-4" aria-live="polite">
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
                <div className="border-b border-slate-100 bg-slate-50/90 px-5 py-3">
                  <h2 className="text-sm font-semibold text-slate-900">
                    AI 분석·정리 요약
                  </h2>
                </div>

                <div className="space-y-3 px-5 py-4">
                  <p className="text-sm text-slate-800">이름: {aiSummary?.이름}</p>
                  <p className="text-sm leading-relaxed text-slate-800">
                    {aiSummary?.요약분석}
                  </p>
                  <p className="text-xs text-slate-600">
                    핵심신호: {aiSummary?.핵심신호.join(" · ")}
                  </p>
                </div>
              </section>

              <section
                className="overflow-hidden border border-slate-300/80 bg-white"
                aria-label="AI 추천 제도 및 기관"
              >
                <div className="border-b border-slate-100 bg-slate-50/90 px-5 py-3">
                  <h2 className="text-sm font-semibold text-slate-900">
                    AI 추천 제도·기관
                  </h2>
                </div>

                <ul className="divide-y divide-slate-100 px-5 py-4">
                  {recommendations.map((rec: StudentAnalyzeRecommendation, index: number) => {
                    const recKey = `${rec.구분}-${rec.기관명}-${index}`;
                    const isOpen = openRecommendationKey === recKey;
                    return (
                      <li key={recKey} className="py-3 first:pt-0 last:pb-0">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenRecommendationKey((prev) =>
                              prev === recKey ? null : recKey,
                            )
                          }
                          className="flex w-full items-start justify-between gap-3 rounded-sm p-1 -m-1 text-left transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003876]/35"
                          aria-expanded={isOpen}
                          aria-controls={`recommendation-panel-${index}`}
                        >
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2 gap-y-1">
                              <span
                                className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                                  rec.구분 === "제도"
                                    ? "bg-violet-100 text-violet-800"
                                    : "bg-emerald-100 text-emerald-800"
                                }`}
                              >
                                {rec.구분}
                              </span>
                              <span className="text-xs font-medium text-slate-500">
                                적합도 {rec.적합도}
                              </span>
                            </div>
                            <p className="mt-2 text-sm font-medium text-slate-900">
                              {rec.기관명}
                            </p>
                            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                              {rec.기관설명}
                            </p>
                          </div>
                          <ChevronDown
                            className={`mt-1 size-4 shrink-0 text-slate-500 transition-transform duration-300 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                            aria-hidden
                          />
                        </button>

                        <div
                          id={`recommendation-panel-${index}`}
                          className={`grid overflow-hidden transition-all duration-300 ease-out ${
                            isOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <section className="min-h-0 space-y-2 border border-slate-200 bg-slate-50/60 p-4">
                            <p className="text-sm text-slate-700">대상: {rec.대상}</p>
                            <p className="text-xs font-semibold text-slate-600">지원 내용</p>
                            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
                              {rec.지원내용.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                            <p className="text-xs font-semibold text-slate-600">신청 절차</p>
                            <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-700">
                              {rec.신청절차.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ol>
                            <p className="text-xs font-semibold text-slate-600">필요 서류</p>
                            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
                              {rec.필요서류.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                            <p className="text-sm text-slate-700">문의: {rec.문의}</p>
                          </section>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
                </>
              ) : !applyApiError ? (
                <p className="rounded-sm border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  표시할 분석 결과가 없습니다. 통합 신청을 다시 시도해 주세요.
                </p>
              ) : null}
            </div>
          ) : (
            <section
              className="flex min-h-[min(360px,50vh)] flex-col items-center justify-center border border-dashed border-slate-200 bg-slate-50/40 px-6 py-12 text-center"
              aria-label="통합 신청 안내"
            >
              <p className="mt-4 text-sm font-medium text-slate-600">
                학생을 선택하고 우측 통합 신청 버튼을 눌러주세요.
              </p>
              <p className="mt-1.5 max-w-sm text-xs text-slate-500">
                클릭하면 AI 분석·정리 요약과 AI 추천 제도·기관이 함께 표시됩니다.
              </p>
            </section>
          )
        ) : (
          <section
            className="flex min-h-[min(360px,50vh)] flex-col items-center justify-center border border-dashed border-slate-200 bg-slate-50/40 px-6 py-12 text-center"
            aria-label="추천 안내"
          >
            <p className="mt-4 text-sm font-medium text-slate-600">
              학생을 선택하고 우측 통합 신청 버튼을 눌러주세요.
            </p>
            <p className="mt-1.5 max-w-sm text-xs text-slate-500">
              클릭하면 AI 분석·정리 요약과 AI 추천 제도·기관이 함께 표시됩니다.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
