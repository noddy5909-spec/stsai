import { SupportInstitutions } from "@/components/SupportInstitutions";
import { SupportApplicationPreview } from "@/components/SupportApplicationPreview";

export default function SupportPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-[#003876]">통합·지원</h1>
        <p className="mt-1 text-sm text-slate-500">기관 안내·서류 초안(목업)</p>
      </div>

      <section className="border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">기관 매칭</h2>
        <p className="mt-1 text-xs text-slate-500">가상 응답 데이터입니다.</p>
        <div className="mt-4">
          <SupportInstitutions />
        </div>
      </section>

      <SupportApplicationPreview />
    </div>
  );
}
