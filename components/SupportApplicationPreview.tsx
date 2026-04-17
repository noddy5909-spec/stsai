"use client";

import { useMemo } from "react";
import { jsPDF } from "jspdf";
import { adminDocSummary, focusStudent, splitGradeClassDisplay } from "@/lib/mock-data";

export function SupportApplicationPreview() {
  const previewBody = useMemo(() => {
    const { gradeLabel, classLabel } = splitGradeClassDisplay(focusStudent.gradeClass);
    return [
      `성명: ${focusStudent.name}`,
      `학년: ${gradeLabel}`,
      `반: ${classLabel}`,
      `학번(일부): ${focusStudent.studentIdMasked}`,
      `사례번호: ${focusStudent.caseRef}`,
      "",
      "【지원 필요 사유(자동 바인딩 요약)】",
      adminDocSummary.replace(/^\[행정 서류용 자동 요약문 — 초안\]\n?/, "").trim(),
    ].join("\n");
  }, []);

  function downloadPdf() {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 48;
    let y = margin;
    doc.setFontSize(14);
    doc.setTextColor(30, 58, 138);
    doc.text("학생지원 신청서 (초안 · 목업)", margin, y);
    y += 28;
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    const lines = doc.splitTextToSize(
      previewBody,
      doc.internal.pageSize.getWidth() - margin * 2,
    );
    lines.forEach((line: string) => {
      if (y > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += 14;
    });
    doc.save(`학생지원신청서_${focusStudent.caseRef}_목업.pdf`);
  }

  return (
    <div className="border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            학생지원 신청서 초안
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            사례 정보가 반영된 미리보기(목업)입니다.
          </p>
        </div>
        <button
          type="button"
          onClick={downloadPdf}
          className="border border-slate-900 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
        >
          PDF 다운로드
        </button>
      </div>
      <div className="mt-4 max-h-[320px] overflow-auto border border-slate-100 bg-white p-4">
        <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-700">
          {previewBody}
        </pre>
      </div>
    </div>
  );
}
