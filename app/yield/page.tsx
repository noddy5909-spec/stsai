import { YieldClient } from "@/components/YieldClient";

export default function YieldPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-[#003876]">사후·관리</h1>
        <p className="mt-1 text-sm text-slate-500">기록·협업·리포트(목업)</p>
      </div>
      <YieldClient />
    </div>
  );
}
