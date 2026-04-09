"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  getObservationsForStudent,
  getSupportRecommendations,
  managedStudents,
  type ObservationEntry,
  type ManagedStudent,
  type SupportRecommendation,
} from "@/lib/mock-data";

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

function summarizeObservations(items: ObservationEntry[]) {
  if (items.length === 0) {
    return {
      overview: "등록된 관찰·상담 일지가 없어 분석 결과를 생성할 수 없습니다.",
      keySignals: ["기록 없음"],
      riskLevel: "낮음",
      suggestedActions: ["관찰 일지 1건 이상 등록 후 다시 확인하세요."],
    };
  }

  const text = items.map((x) => `${x.content} ${(x.tags ?? []).join(" ")}`).join(" ");
  const hasEmotional = /정서|불안|스트레스|우울|불면|회피/.test(text);
  const hasAcademic = /학업|과제|수업|성적|수행/.test(text);
  const hasAttendance = /출석|지각|결석|무단/.test(text);
  const hasHealth = /건강|두통|수면|급식|식이|보건/.test(text);
  const hasFamily = /가족|보호자|가정|부모/.test(text);

  const keySignals: string[] = [];
  if (hasEmotional) keySignals.push("정서 안정 지원 필요 신호");
  if (hasAcademic) keySignals.push("학업 참여/수행 관련 관찰");
  if (hasAttendance) keySignals.push("출석·생활 관리 관찰");
  if (hasHealth) keySignals.push("보건·생활습관 점검 필요");
  if (hasFamily) keySignals.push("가정 연계 상담 필요 신호");
  if (keySignals.length === 0) keySignals.push("일반 관찰 기록 중심");

  const riskScore =
    (hasEmotional ? 2 : 0) +
    (hasAttendance ? 2 : 0) +
    (hasHealth ? 1 : 0) +
    (hasFamily ? 1 : 0) +
    (hasAcademic ? 1 : 0);
  const riskLevel = riskScore >= 4 ? "높음" : riskScore >= 2 ? "보통" : "낮음";

  const suggestedActions: string[] = [];
  if (hasEmotional) suggestedActions.push("상담 주기 단축 및 정서 체크리스트 병행");
  if (hasAcademic) suggestedActions.push("교과 담당과 과제/수업 참여 회복 계획 공유");
  if (hasAttendance) suggestedActions.push("출결 패턴 점검 및 조기 개입 기준선 합의");
  if (hasHealth) suggestedActions.push("보건실 기록과 연계해 수면·식이 상태 확인");
  if (hasFamily) suggestedActions.push("보호자 소통 일정 확정 및 가정 연계 지원 검토");
  if (suggestedActions.length === 0) {
    suggestedActions.push("현재 관찰 흐름 유지하며 주간 단위로 변화 추적");
  }

  return {
    overview: `총 ${items.length}건의 관찰·상담 일지를 분석한 결과, ${keySignals[0]}가 주요 축으로 나타났습니다.`,
    keySignals,
    riskLevel,
    suggestedActions: suggestedActions.slice(0, 3),
  };
}

function buildRagInfo(rec: SupportRecommendation, student: ManagedStudent) {
  const isPolicy = rec.category === "제도";
  return {
    sourceLabel: isPolicy ? "정책·지침 RAG" : "기관 안내 RAG",
    target: `${student.name} · ${student.gradeClass} · ${student.supportArea}`,
    summary: isPolicy
      ? "교육청/학교 적용 가능 지침에서 해당 학생 유형과 유사한 지원 항목을 검색해 요약했습니다."
      : "지역 기관 안내 데이터에서 학생 특성과 연관성이 높은 기관 정보를 검색해 요약했습니다.",
    supportTarget: isPolicy
      ? "학업·정서·출결 등 복합 지원이 필요한 학생"
      : "상담·복지·보건 연계가 필요한 학생 및 보호자",
    supportContent: isPolicy
      ? [
          "학교 내 다부서 협업(담임·상담·보건·행정) 기반 지원 절차 안내",
          "학생 상태에 따른 단계별 개입 기준 및 사례 관리 항목",
          "필요 시 외부 전문기관 연계 및 사후 모니터링 권고",
        ]
      : [
          "기관별 상담·복지·의료 연계 가능 서비스 안내",
          "초기 접수 후 사례평가 및 개입 계획 수립 절차",
          "학교-기관-보호자 간 정보 공유 및 일정 조율 지원",
        ],
    howToApply: [
      "학교 내부 협의(담임/상담/보건) 후 대상자 등록",
      "보호자 안내 및 동의 절차 진행",
      "기관 또는 지침에 맞는 신청서 제출",
      "접수 결과 확인 후 연계 일정 확정",
    ],
    documents: [
      "학생 기초 정보 및 관찰·상담 일지",
      "보호자 동의서(필요 시)",
      "지원 필요성 요약서 또는 학교 내부 협의 기록",
    ],
    contact: isPolicy
      ? "교육청 학생지원 담당 / 학교 통합지원 담당자"
      : "해당 기관 대표번호 및 학교 연계 담당자",
    caution:
      "아래 정보는 RAG 검색 기반 목업입니다. 실제 신청 전 최신 공문/기관 공지와 자격 요건을 반드시 확인하세요.",
  };
}

export function ExchangeClient() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [listOpen, setListOpen] = useState(false);
  const [screenMode, setScreenMode] = useState<"overview" | "apply">("overview");
  const [selectedRecommendation, setSelectedRecommendation] =
    useState<SupportRecommendation | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const selectedStudent = useMemo(
    () => managedStudents.find((s) => s.id === selectedId) ?? null,
    [selectedId],
  );

  const recommendations = useMemo(
    () =>
      selectedStudent ? getSupportRecommendations(selectedStudent) : [],
    [selectedStudent],
  );
  const observations = useMemo(
    () => (selectedStudent ? getObservationsForStudent(selectedStudent.id) : []),
    [selectedStudent],
  );
  const aiSummary = useMemo(
    () => summarizeObservations(observations),
    [observations],
  );
  const selectedRagInfo = useMemo(
    () =>
      selectedRecommendation && selectedStudent
        ? buildRagInfo(selectedRecommendation, selectedStudent)
        : null,
    [selectedRecommendation, selectedStudent],
  );

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
                          setScreenMode("overview");
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
            onClick={() => {
              setSelectedRecommendation(null);
              setScreenMode("apply");
            }}
            disabled={!selectedStudent}
            className="h-[58px] shrink-0 border border-[#003876] bg-[#003876] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#002d5c] disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-200 disabled:text-slate-500"
          >
            통합 신청
          </button>
        </div>
      </div>

      <div className="w-full min-w-0">
        {selectedStudent ? (
          screenMode === "apply" ? (
            <section
              className="overflow-hidden border border-slate-300/80 bg-white"
              aria-live="polite"
              aria-label="AI 추천 제도 및 기관"
            >
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 bg-slate-50/90 px-5 py-3">
                <h2 className="text-sm font-semibold text-slate-900">
                  AI 추천 제도·기관
                </h2>
                <span className="rounded-full bg-[#003876]/12 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#003876]">
                  목업 알고리즘
                </span>
                <p className="w-full text-xs text-slate-500 sm:w-auto sm:pl-2">
                  선택:{" "}
                  <span className="font-medium text-slate-800">
                    {selectedStudent.name}
                  </span>
                  <span className="text-slate-400"> · </span>
                  {selectedStudent.supportArea} · {selectedStudent.status}
                </p>
              </div>

              {selectedRecommendation ? (
                <div className="space-y-5 px-5 py-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                        selectedRecommendation.category === "제도"
                          ? "bg-violet-100 text-violet-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {selectedRecommendation.category}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      적합도 {selectedRecommendation.confidencePercent}%
                    </span>
                    <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold text-sky-800">
                      {selectedRagInfo?.sourceLabel}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-slate-900">
                      {selectedRecommendation.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-700">
                      {selectedRagInfo?.summary}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      대상: {selectedRagInfo?.target}
                    </p>
                  </div>

                  <section className="space-y-2 border border-slate-200 bg-slate-50/60 p-4">
                    <h4 className="text-sm font-semibold text-slate-900">
                      {selectedRecommendation.category} 정보
                    </h4>
                    <p className="text-sm text-slate-700">
                      지원 대상: {selectedRagInfo?.supportTarget}
                    </p>
                    <p className="text-xs font-semibold text-slate-600">지원 내용</p>
                    <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
                      {selectedRagInfo?.supportContent.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <p className="text-xs font-semibold text-slate-600">신청 절차</p>
                    <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-700">
                      {selectedRagInfo?.howToApply.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ol>
                    <p className="text-xs font-semibold text-slate-600">필요 서류</p>
                    <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
                      {selectedRagInfo?.documents.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <p className="text-sm text-slate-700">
                      문의: {selectedRagInfo?.contact}
                    </p>
                    <p className="text-xs text-slate-500">{selectedRagInfo?.caution}</p>
                  </section>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setSelectedRecommendation(null)}
                      className="border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      목록으로
                    </button>
                  </div>
                </div>
              ) : (
                <ul className="divide-y divide-slate-100 px-5 py-4">
                  {recommendations.map((rec) => (
                    <li key={rec.id} className="py-4 first:pt-0 last:pb-0">
                      <button
                        type="button"
                        onClick={() => setSelectedRecommendation(rec)}
                        className="block w-full rounded-sm p-1 -m-1 text-left transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003876]/35"
                      >
                        <div className="flex flex-wrap items-center gap-2 gap-y-1">
                          <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                              rec.category === "제도"
                                ? "bg-violet-100 text-violet-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {rec.category}
                          </span>
                          <span className="text-xs font-medium text-slate-500">
                            적합도 {rec.confidencePercent}%
                          </span>
                        </div>
                        <p className="mt-2 text-sm font-medium text-slate-900">
                          {rec.title}
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                          {rec.rationale}
                        </p>
                        <div
                          className="mt-2 h-1.5 max-w-xs overflow-hidden rounded-full bg-slate-100"
                          aria-hidden
                        >
                          <div
                            className="h-full rounded-full bg-[#003876]/90"
                            style={{ width: `${rec.confidencePercent}%` }}
                          />
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ) : (
            <div className="space-y-4" aria-live="polite">
              <section
                className="overflow-hidden border border-slate-300/80 bg-white"
                aria-label="AI 분석 정리 요약"
              >
                <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 bg-slate-50/90 px-5 py-3">
                  <h2 className="text-sm font-semibold text-slate-900">
                    AI 분석·정리 요약
                  </h2>
                  <span className="rounded-full bg-[#003876]/12 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#003876]">
                    목업
                  </span>
                  <p className="w-full text-xs text-slate-500 sm:w-auto sm:pl-2">
                    선택:{" "}
                    <span className="font-medium text-slate-800">
                      {selectedStudent.name}
                    </span>
                    <span className="text-slate-400"> · </span>
                    {selectedStudent.supportArea} · {selectedStudent.status}
                  </p>
                </div>

                <div className="space-y-3 px-5 py-4">
                  <p className="text-sm leading-relaxed text-slate-800">
                    {aiSummary.overview}
                  </p>
                  <p className="text-xs text-slate-600">
                    핵심 신호: {aiSummary.keySignals.slice(0, 2).join(" · ")}
                  </p>
                  {recommendations.length > 0 ? (
                    <p className="text-xs text-slate-500">
                      참고 추천: {recommendations[0].title}
                    </p>
                  ) : null}
                </div>
              </section>

              <section
                className="overflow-hidden border border-slate-300/80 bg-white"
                aria-label="관찰 및 상담 일지"
              >
                <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 bg-slate-50/90 px-5 py-3">
                  <h2 className="text-sm font-semibold text-slate-900">
                    관찰 및 상담 일지
                  </h2>
                  <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-medium tracking-wide text-slate-700">
                    {observations.length}건
                  </span>
                </div>

                {observations.length > 0 ? (
                  <ul className="divide-y divide-slate-100 px-5 py-4">
                    {observations.map((obs) => (
                      <li key={obs.id} className="py-4 first:pt-0 last:pb-0">
                        <p className="text-xs text-slate-500">
                          {obs.role} · {obs.author} · {obs.createdAt}
                        </p>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
                          {obs.content}
                        </p>
                        {obs.tags && obs.tags.length > 0 ? (
                          <p className="mt-2 text-xs text-slate-500">
                            {obs.tags.join(" · ")}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="px-5 py-8 text-sm text-slate-500">
                    등록된 관찰 및 상담 일지가 없습니다.
                  </p>
                )}
              </section>
            </div>
          )
        ) : (
          <section
            className="flex min-h-[min(360px,50vh)] flex-col items-center justify-center border border-dashed border-slate-200 bg-slate-50/40 px-6 py-12 text-center"
            aria-label="추천 안내"
          >
            <p className="mt-4 text-sm font-medium text-slate-600">
              학생을 선택하면 관찰 및 상담 일지와 AI 분석 결과가 표시됩니다.
            </p>
            <p className="mt-1.5 max-w-sm text-xs text-slate-500">
              화면 상단에서 대상 학생을 고른 뒤 확인해 보세요.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
