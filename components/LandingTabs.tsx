"use client";

import { useState } from "react";

const mediaTabs = [
  { id: "youtube", label: "동영상(목업)" },
  { id: "blog", label: "블로그(목업)" },
  { id: "sns", label: "SNS(목업)" },
] as const;

const noticeTabs = [
  { id: "notice", label: "공지" },
  { id: "hire", label: "채용(목업)" },
  { id: "law", label: "법령·행정(목업)" },
] as const;

export function LandingMediaTabs() {
  const [media, setMedia] = useState<(typeof mediaTabs)[number]["id"]>("youtube");
  return (
    <div>
      <div className="flex flex-wrap gap-0 border-b border-slate-200">
        {mediaTabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setMedia(t.id)}
            className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              media === t.id
                ? "border-[#003876] text-[#003876]"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-4 aspect-video max-h-56 w-full bg-slate-200/80">
        <div className="flex h-full items-center justify-center text-sm text-slate-500">
          {media === "youtube" && "미리보기 영역(목업)"}
          {media === "blog" && "블로그 카드 영역(목업)"}
          {media === "sns" && "SNS 피드 영역(목업)"}
        </div>
      </div>
      <ul className="mt-4 divide-y divide-slate-100 border-t border-slate-200">
        {[
          "통합지원 프로세스 소개 영상(목업)",
<<<<<<< HEAD
          "관찰 및 상담 일지 작성 가이드(목업)",
=======
          "관찰일지 작성 가이드(목업)",
>>>>>>> 591fd6b54b028640e0305966d84a48de2a70a24c
          "학맞통 EASY 데모 시연(목업)",
        ].map((t) => (
          <li key={t} className="py-2.5 text-sm text-slate-700">
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LandingNoticeTabs() {
  const [tab, setTab] = useState<(typeof noticeTabs)[number]["id"]>("notice");
  const items: Record<string, { title: string; date: string }[]> = {
    notice: [
      { title: "학맞통 EASY UI 프로토타입 배포(목업)", date: "2026-04-03" },
<<<<<<< HEAD
      { title: "관찰 및 상담 일지 양식 개정 안내(목업)", date: "2026-04-01" },
=======
      { title: "통합 관찰일지 양식 개정 안내(목업)", date: "2026-04-01" },
>>>>>>> 591fd6b54b028640e0305966d84a48de2a70a24c
      { title: "시스템 점검 없음(목업)", date: "2026-03-28" },
    ],
    hire: [
      { title: "교육 지원 인력 채용 공고(목업)", date: "2026-03-30" },
      { title: "현장 상담 모집(목업)", date: "2026-03-22" },
    ],
    law: [
      { title: "학생맞춤형 통합지원 관련 법령 안내(목업)", date: "2026-03-15" },
      { title: "개인정보 처리방침(목업)", date: "2026-03-10" },
    ],
  };
  return (
    <div>
      <div className="flex flex-wrap gap-0 border-b border-slate-200">
        {noticeTabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`border-b-2 px-3 py-3 text-sm font-medium transition-colors sm:px-4 ${
              tab === t.id
                ? "border-[#003876] text-[#003876]"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <ul className="mt-4 space-y-0 divide-y divide-slate-100 border-t border-slate-200">
        {items[tab].map((row) => (
          <li
            key={row.title}
            className="flex items-start justify-between gap-4 py-3 text-sm"
          >
            <span className="min-w-0 text-slate-800">{row.title}</span>
            <span className="shrink-0 tabular-nums text-slate-500">{row.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
