"use client";

import { useMemo, useState } from "react";
import { ManagedStudentsWithTabs } from "@/components/ManagedStudentsWithTabs";
import {
  getObservationsForStudent,
  managedStudents,
  notifications,
  observationTagOptions,
  type ObservationEntry,
} from "@/lib/mock-data";

function toDateTimeLocalValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function toDisplayDateTime(input: string) {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return input.replace("T", " ");
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function counselTemplate() {
  return `상담 장소: \n\n내용: \n\n특이사항: `;
}

export default function DashboardPage() {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [draftContent, setDraftContent] = useState(counselTemplate);
  const [draftTag, setDraftTag] = useState("");
  const [draftCounselAt, setDraftCounselAt] = useState(() =>
    toDateTimeLocalValue(new Date()),
  );

  const selectedStudent = useMemo(
    () => managedStudents.find((s) => s.id === selectedStudentId) ?? null,
    [selectedStudentId],
  );
  const [observationsByStudent, setObservationsByStudent] = useState<
    Record<string, ObservationEntry[]>
  >(() => {
    const seed: Record<string, ObservationEntry[]> = {};
    for (const s of managedStudents) seed[s.id] = getObservationsForStudent(s.id);
    return seed;
  });
  const selectedObservations = useMemo(
    () => (selectedStudent ? (observationsByStudent[selectedStudent.id] ?? []) : []),
    [observationsByStudent, selectedStudent],
  );

  return (
    <div
      className={`grid grid-cols-1 gap-6 lg:items-stretch ${
        selectedStudent
          ? "lg:grid-cols-[6.5fr_3.5fr]"
          : "lg:grid-cols-[3fr_1fr]"
      }`}
    >
      <div className="min-w-0">
        <ManagedStudentsWithTabs onStudentSelect={setSelectedStudentId} />
      </div>

      <aside className="min-w-0 h-full lg:self-stretch">
        {selectedStudent ? (
          <section className="flex h-full flex-col border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#003876]">상담일지</h2>
              <button
                type="button"
                onClick={() => setSelectedStudentId(null)}
                className="text-xs text-slate-500 underline underline-offset-2 hover:text-slate-700"
              >
                알림으로
              </button>
            </div>
            <p className="text-xs text-slate-500">
              {selectedStudent.name} · {selectedStudent.gradeClass}
            </p>
            <form
              className="mt-3 space-y-2 border-t border-slate-100 pt-3"
              onSubmit={(e) => {
                e.preventDefault();
                const content = draftContent.trim();
                if (!content || !selectedStudent) return;
                const tags = draftTag ? [draftTag] : [];
                const createdAt = draftCounselAt
                  ? toDisplayDateTime(draftCounselAt)
                  : toDisplayDateTime(toDateTimeLocalValue(new Date()));
                const entry: ObservationEntry = {
                  id: `${selectedStudent.id}-${Date.now()}`,
                  role: "담임",
                  author: "로그인 사용자",
                  visibility: "public",
                  content,
                  createdAt,
                  tags: tags.length ? tags : undefined,
                };
                setObservationsByStudent((prev) => ({
                  ...prev,
                  [selectedStudent.id]: [entry, ...(prev[selectedStudent.id] ?? [])],
                }));
                setDraftContent(counselTemplate());
                setDraftTag("");
                setDraftCounselAt(toDateTimeLocalValue(new Date()));
              }}
            >
              <label className="grid gap-1">
                <span className="sr-only">태그</span>
                <select
                  value={draftTag}
                  onChange={(e) => setDraftTag(e.target.value)}
                  aria-label="태그 선택"
                  className="h-8 w-full rounded border border-slate-200 bg-white px-2 text-xs text-slate-800"
                >
                  <option value="">태그 선택</option>
                  {observationTagOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </label>
              <input
                type="datetime-local"
                value={draftCounselAt}
                onChange={(e) => setDraftCounselAt(e.target.value)}
                aria-label="상담 날짜 및 시간"
                className="h-8 w-full rounded border border-slate-200 px-2 text-xs text-slate-700"
              />
              <textarea
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
                rows={10}
                placeholder={`상담 장소/내용/특이사항을 입력해 주세요.\n\n${counselTemplate()}`}
                className="min-h-[320px] w-full resize-y rounded border border-slate-200 px-2 py-2 text-sm"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded bg-[#003876] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#002c5d]"
                >
                  등록
                </button>
              </div>
            </form>
            <ul className="mt-3 min-h-0 flex-1 divide-y divide-slate-100 overflow-y-auto border-t border-slate-100">
              {selectedObservations.length > 0 ? (
                selectedObservations.map((obs) => (
                  <li key={obs.id} className="py-2.5">
                    <p className="text-[11px] text-slate-500">
                      {obs.role} · {obs.author} · {obs.createdAt}
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-sm leading-snug text-slate-700">
                      {obs.content}
                    </p>
                    {obs.tags && obs.tags.length > 0 && (
                      <p className="mt-1 text-xs text-slate-400">{obs.tags.join(" · ")}</p>
                    )}
                  </li>
                ))
              ) : (
                <li className="py-3 text-sm text-slate-500">등록된 상담일지가 없습니다.</li>
              )}
            </ul>
          </section>
        ) : (
          <section className="flex h-full flex-col border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-[#003876]">알림</h2>
            <ul className="mt-3 min-h-0 flex-1 divide-y divide-slate-100 overflow-y-auto border-t border-slate-100">
              {notifications.map((item) => (
                <li key={item.id} className="py-2.5">
                  <p className="text-xs font-medium text-slate-700">{item.dept}</p>
                  <p className="mt-0.5 text-sm leading-snug text-slate-700">{item.message}</p>
                  <p className="mt-1 text-xs text-slate-400">{item.time}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </aside>
    </div>
  );
}
