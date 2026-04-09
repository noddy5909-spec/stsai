import { FileText } from "lucide-react";

const formItems = [
  {
    id: "f1",
    title: "학생맞춤형 통합지원 신청서(초안)",
    category: "통합지원",
    desc: "통합지원 TF·협의 시 제출용 양식(목업)",
    format: "HWP · PDF",
  },
  {
    id: "f2",
    title: "관찰 및 상담 일지 공유 동의서",
    category: "관찰·상담",
    desc: "다부서 공유 시 보호자·교직원 동의 기록(목업)",
    format: "PDF",
  },
  {
    id: "f3",
    title: "위기학생 개입 협의 요청서",
    category: "학생보호",
    desc: "학생지원심의·보호 절차 연계용(목업)",
    format: "HWP",
  },
  {
    id: "f4",
    title: "외부 기관 연계 의뢰서",
    category: "기관연계",
    desc: "복지·상담·보건 기관 연계 시 사용(목업)",
    format: "HWP · PDF",
  },
  {
    id: "f5",
    title: "행정 공문용 사례 요약 양식",
    category: "행정",
    desc: "관찰일지 기반 자동 요약 초안 첨부용(목업)",
    format: "DOCX",
  },
  {
    id: "f6",
    title: "학부모 안내 문자·통지 초안",
    category: "소통",
    desc: "지원 일정·동의 안내 문구 템플릿(목업)",
    format: "TXT · DOCX",
  },
] as const;

export default function FormsPanelPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#003876]">서식 모음</h1>
        <p className="mt-1 text-sm text-slate-500">
          업무에 자주 쓰는 양식을 한곳에서 확인합니다. 실제 파일은 제공되지 않으며
          목업입니다.
        </p>
      </div>

      <section
        className="border border-slate-200 bg-white shadow-sm"
        aria-label="서식 목록 패널"
      >
        <div className="border-b border-slate-100 bg-slate-50/90 px-5 py-3">
          <h2 className="text-sm font-semibold text-slate-900">다운로드·참고</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            항목을 선택하면 상세(목업)로 이동할 수 있습니다.
          </p>
        </div>
        <ul className="divide-y divide-slate-100">
          {formItems.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className="flex w-full items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003876]/35"
              >
                <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded border border-slate-200 bg-white text-[#003876]">
                  <FileText className="size-5" strokeWidth={1.75} aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="inline-block rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                    {item.category}
                  </span>
                  <span className="mt-1 block text-sm font-semibold text-slate-900">
                    {item.title}
                  </span>
                  <span className="mt-1 block text-xs text-slate-600">{item.desc}</span>
                  <span className="mt-2 text-[11px] text-slate-400">
                    형식: {item.format}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
