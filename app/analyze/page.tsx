import { KeywordBubbles } from "@/components/KeywordBubbles";
import {
  adminDocSummary,
  aiSummary,
  focusStudent,
} from "@/lib/mock-data";

export default function AnalyzePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-[#003876]">통합·진단</h1>
        <p className="mt-1 text-sm text-slate-500">분석 결과(목업)</p>
      </div>

      <section className="border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">분석 대상</h2>
        <p className="mt-1 text-sm text-slate-600">
          {focusStudent.name} · {focusStudent.gradeClass}
        </p>
      </section>

      <section className="border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">핵심 키워드</h2>
        <p className="mt-1 text-xs text-slate-500">가중치는 목업입니다.</p>
        <div className="mt-4">
          <KeywordBubbles />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-slate-900">분석 요약</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-700">
            {aiSummary}
          </p>
        </div>
        <div className="border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-slate-900">
            행정 서류용 자동 요약문
          </h2>
          <pre className="mt-3 whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-600">
            {adminDocSummary}
          </pre>
        </div>
      </section>
    </div>
  );
}
