"use client";

import { X } from "lucide-react";
import { useMemo, useState } from "react";
import {
  getObservationsForStudent,
  managedStudents,
  type ManagedStudent,
  type ObservationEntry,
<<<<<<< HEAD
  type ObservationRole,
=======
>>>>>>> 591fd6b54b028640e0305966d84a48de2a70a24c
} from "@/lib/mock-data";

type ManagedStudentStatus = ManagedStudent["status"];

function statusTextClass(status: ManagedStudentStatus) {
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

<<<<<<< HEAD
function nowTimestamp() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

=======
>>>>>>> 591fd6b54b028640e0305966d84a48de2a70a24c
function ObservationTimeline({ items }: { items: ObservationEntry[] }) {
  if (items.length === 0) {
    return (
      <p className="px-5 py-10 text-center text-sm text-slate-500">
<<<<<<< HEAD
        등록된 관찰 및 상담 일지가 없습니다(목업).
=======
        등록된 통합 관찰일지가 없습니다(목업).
>>>>>>> 591fd6b54b028640e0305966d84a48de2a70a24c
      </p>
    );
  }

  return (
    <div className="max-h-[min(70vh,520px)] overflow-y-auto px-5 py-4">
      <ul className="divide-y divide-slate-200 border-t border-slate-200">
        {items.map((obs) => (
          <li key={obs.id} className="py-4">
<<<<<<< HEAD
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
              <span>
                {obs.role} · {obs.author} · {obs.createdAt}
              </span>
              {obs.visibility === "private" && (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                  비공개
                </span>
              )}
=======
            <p className="text-xs text-slate-500">
              {obs.role} · {obs.author} · {obs.createdAt}
>>>>>>> 591fd6b54b028640e0305966d84a48de2a70a24c
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
              {obs.content}
            </p>
            {obs.tags && obs.tags.length > 0 && (
              <p className="mt-2 text-xs text-slate-500">
                {obs.tags.join(" · ")}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ManagedStudentsWithTabs() {
<<<<<<< HEAD
  const currentUser = useMemo(
    () =>
      ({
        role: "담임" as ObservationRole,
        author: "로그인 사용자",
      }) satisfies { role: ObservationRole; author: string },
    [],
  );

=======
>>>>>>> 591fd6b54b028640e0305966d84a48de2a70a24c
  const studentById = useMemo(
    () => Object.fromEntries(managedStudents.map((s) => [s.id, s])),
    [],
  );

  const [openJournalIds, setOpenJournalIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"list" | string>("list");

<<<<<<< HEAD
  const [observationsByStudent, setObservationsByStudent] = useState<
    Record<string, ObservationEntry[]>
  >(() => {
    const seed: Record<string, ObservationEntry[]> = {};
    for (const s of managedStudents) {
      seed[s.id] = getObservationsForStudent(s.id);
    }
    return seed;
  });

  const [draftContent, setDraftContent] = useState("");
  const [draftTags, setDraftTags] = useState("");
  const [draftVisibility, setDraftVisibility] = useState<
    ObservationEntry["visibility"]
  >("public");

=======
>>>>>>> 591fd6b54b028640e0305966d84a48de2a70a24c
  function openStudentJournal(studentId: string) {
    setOpenJournalIds((prev) =>
      prev.includes(studentId) ? prev : [...prev, studentId],
    );
    setActiveTab(studentId);
  }

  function closeJournalTab(studentId: string, e: React.MouseEvent) {
    e.stopPropagation();
    setOpenJournalIds((prev) => prev.filter((id) => id !== studentId));
    setActiveTab((cur) => {
      if (cur !== studentId) return cur;
      return "list";
    });
  }

  const activeStudent =
    activeTab !== "list" ? studentById[activeTab] : undefined;
  const activeObservations =
<<<<<<< HEAD
    activeTab !== "list" ? (observationsByStudent[activeTab] ?? []) : [];
=======
    activeTab !== "list" ? getObservationsForStudent(activeTab) : [];
>>>>>>> 591fd6b54b028640e0305966d84a48de2a70a24c

  const tabBarBg = "bg-[#dde6f0]";

  const tabBase =
    "max-w-[268px] shrink-0 truncate rounded-t-xl px-3.5 py-2 text-left text-sm leading-snug " +
    "transition-[color,background-color] duration-150 ease-out " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003876]/45 " +
    "focus-visible:ring-offset-2 focus-visible:ring-offset-[#dde6f0] sm:max-w-[308px]";

  return (
    <section className="overflow-hidden border border-slate-300/80 bg-white">
      <div
        className={`flex flex-nowrap items-end gap-1 overflow-x-auto overflow-y-visible px-1 pt-1 pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${tabBarBg}`}
        role="tablist"
<<<<<<< HEAD
        aria-label="관리 학생 및 관찰 및 상담 일지"
=======
        aria-label="관리 학생 및 관찰일지"
>>>>>>> 591fd6b54b028640e0305966d84a48de2a70a24c
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "list"}
          onClick={() => setActiveTab("list")}
          className={`relative z-[1] ${tabBase} ${
            activeTab === "list"
              ? "-mb-px rounded-b-xl border-b border-white bg-white font-semibold text-slate-900 ring-offset-white"
              : "text-slate-500 hover:bg-white/70 hover:text-slate-800"
          }`}
        >
          관리 학생 명단
        </button>

        {openJournalIds.map((sid) => {
          const s = studentById[sid];
          if (!s) return null;
          const selected = activeTab === sid;
          return (
            <div
              key={sid}
              className={`flex min-w-0 max-w-[288px] shrink-0 items-stretch overflow-hidden rounded-t-xl sm:max-w-[332px] ${
                selected
                  ? "relative z-[1] -mb-px rounded-b-xl border-b border-white bg-white text-slate-900 ring-offset-white"
                  : "text-slate-500 hover:bg-white/65 hover:text-slate-800"
              } transition-[color,background-color] duration-150 ease-out`}
            >
              <button
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveTab(sid)}
                className={`flex min-w-0 flex-1 items-center truncate px-3.5 py-2 text-left text-sm leading-snug transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003876]/45 focus-visible:ring-inset ${
                  selected ? "font-semibold text-slate-900" : ""
                }`}
              >
<<<<<<< HEAD
                {s.name} · 관찰 및 상담 일지
=======
                {s.name} · 관찰일지
>>>>>>> 591fd6b54b028640e0305966d84a48de2a70a24c
              </button>
              <button
                type="button"
                className={`flex w-8 shrink-0 items-center justify-center self-stretch transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003876]/45 focus-visible:ring-inset ${
                  selected
                    ? "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    : "text-slate-400/90 hover:bg-black/[0.07] hover:text-slate-800"
                }`}
<<<<<<< HEAD
                aria-label={`${s.name} 관찰 및 상담 일지 탭 닫기`}
=======
                aria-label={`${s.name} 관찰일지 탭 닫기`}
>>>>>>> 591fd6b54b028640e0305966d84a48de2a70a24c
                onClick={(e) => closeJournalTab(sid, e)}
              >
                <X className="size-4 shrink-0" strokeWidth={2.25} aria-hidden />
              </button>
            </div>
          );
        })}
      </div>

      <div className="-mt-px bg-white" role="tabpanel">
        {activeTab === "list" ? (
          <>
            <div className="border-b border-slate-100 px-5 py-3">
              <p className="text-xs text-slate-500">
<<<<<<< HEAD
                행을 선택하면 관찰 및 상담 일지 탭이 열립니다. 총{" "}
=======
                행을 선택하면 통합 관찰일지 탭이 열립니다. 총{" "}
>>>>>>> 591fd6b54b028640e0305966d84a48de2a70a24c
                {managedStudents.length}명(목업).
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-medium text-slate-500">
                    <th className="px-5 py-3">이름</th>
                    <th className="px-5 py-3">학년·반</th>
                    <th className="px-5 py-3">사례번호</th>
                    <th className="px-5 py-3">지원영역</th>
                    <th className="px-5 py-3">상태</th>
                    <th className="px-5 py-3">최근 갱신</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {managedStudents.map((row) => {
                    return (
                      <tr
                        key={row.id}
                        tabIndex={0}
                        onClick={() => openStudentJournal(row.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            openStudentJournal(row.id);
                          }
                        }}
                        className="cursor-pointer hover:bg-slate-50"
                      >
                        <td className="px-5 py-3 font-medium text-slate-900">
                          {row.name}
                        </td>
                        <td className="px-5 py-3 text-slate-600">
                          {row.gradeClass}
                        </td>
                        <td className="px-5 py-3 font-mono text-xs text-slate-700">
                          {row.caseRef}
                        </td>
                        <td className="px-5 py-3 text-slate-600">
                          {row.supportArea}
                        </td>
                        <td
                          className={`px-5 py-3 text-xs font-medium ${statusTextClass(row.status)}`}
                        >
                          {row.status}
                        </td>
                        <td className="px-5 py-3 text-xs text-slate-500">
                          {row.lastUpdated}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          activeStudent && (
            <>
              <div className="border-b border-slate-100 px-5 py-4">
                <p className="text-sm font-medium text-slate-900">
                  {activeStudent.name}
                  <span className="font-normal text-slate-500">
                    {" "}
                    · {activeStudent.gradeClass} · {activeStudent.caseRef}
                  </span>
                </p>
                <p className="mt-1 text-xs text-slate-500">
<<<<<<< HEAD
                  관찰 및 상담 일지 · 공동 작성(목업)
                </p>
              </div>
              <div className="border-b border-slate-100 px-5 py-4">
                <form
                  className="grid gap-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!activeStudent) return;
                    const content = draftContent.trim();
                    if (!content) return;

                    const tags = draftTags
                      .split(/[,\n]/g)
                      .map((t) => t.trim())
                      .filter(Boolean);

                    const entry: ObservationEntry = {
                      id: `${activeStudent.id}-${Date.now()}`,
                      role: currentUser.role,
                      author: currentUser.author,
                      visibility: draftVisibility,
                      content,
                      createdAt: nowTimestamp(),
                      tags: tags.length ? tags : undefined,
                    };

                    setObservationsByStudent((prev) => ({
                      ...prev,
                      [activeStudent.id]: [entry, ...(prev[activeStudent.id] ?? [])],
                    }));
                    setDraftContent("");
                    setDraftTags("");
                    setDraftVisibility("public");
                  }}
                >
                  <div className="grid gap-3 sm:grid-cols-12 sm:items-end">
                    <label className="grid gap-1 sm:col-span-7">
                      <span className="text-xs font-medium text-slate-600">
                        태그(선택)
                      </span>
                      <input
                        value={draftTags}
                        onChange={(e) => setDraftTags(e.target.value)}
                        placeholder="예: 출석, 과제, 정서"
                        className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 shadow-sm outline-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#003876]/35"
                      />
                    </label>

                    <fieldset className="grid gap-1 sm:col-span-5">
                      <legend className="text-xs font-medium text-slate-600">
                        공개 범위
                      </legend>
                      <div className="flex h-10 items-center gap-4 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 shadow-sm">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="visibility"
                            value="public"
                            checked={draftVisibility === "public"}
                            onChange={() => setDraftVisibility("public")}
                          />
                          <span>공개</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="visibility"
                            value="private"
                            checked={draftVisibility === "private"}
                            onChange={() => setDraftVisibility("private")}
                          />
                          <span>비공개</span>
                        </label>
                      </div>
                    </fieldset>
                  </div>

                  <label className="grid gap-1">
                    <span className="text-xs font-medium text-slate-600">
                      관찰 내용
                    </span>
                    <textarea
                      value={draftContent}
                      onChange={(e) => setDraftContent(e.target.value)}
                      rows={4}
                      placeholder="여러 담당자가 함께 참고할 수 있도록 사실/맥락/요청사항을 간단히 남겨주세요."
                      className="resize-y rounded-md border border-slate-200 bg-white px-3 py-2 text-sm leading-relaxed text-slate-800 shadow-sm outline-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#003876]/35"
                    />
                  </label>

                  <div className="flex items-center justify-end">
                    <button
                      type="submit"
                      className="h-10 rounded-md bg-[#003876] px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#002c5d]"
                    >
                      관찰 및 상담 일지 등록
                    </button>
                  </div>
                </form>
              </div>
=======
                  통합 관찰일지(목업)
                </p>
              </div>
>>>>>>> 591fd6b54b028640e0305966d84a48de2a70a24c
              <ObservationTimeline items={activeObservations} />
            </>
          )
        )}
      </div>
    </section>
  );
}
