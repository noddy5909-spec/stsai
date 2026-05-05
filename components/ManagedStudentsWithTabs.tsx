"use client";

import { X } from "lucide-react";
import { useMemo, useState } from "react";
import {
  getObservationsForStudent,
  managedStudentSummaryLine,
  managedStudents,
  observationTagOptions,
  splitGradeClassDisplay,
  studentApplicationDetailsById,
  type ManagedStudent,
  type ObservationEntry,
  type ObservationRole,
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

function nowTimestamp() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function ObservationTimeline({ items }: { items: ObservationEntry[] }) {
  if (items.length === 0) {
    return (
      <p className="px-5 py-10 text-center text-sm text-slate-500">
        등록된 관찰 및 상담 일지가 없습니다(목업).
      </p>
    );
  }

  return (
    <div className="max-h-[min(70vh,520px)] overflow-y-auto px-5 py-4">
      <ul className="divide-y divide-slate-200 border-t border-slate-200">
        {items.map((obs) => (
          <li key={obs.id} className="py-4">
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
              <span>
                {obs.role} · {obs.author} · {obs.createdAt}
              </span>
              {obs.visibility === "private" && (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                  비공개
                </span>
              )}
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

function DetailRow({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="grid grid-cols-[9rem_1fr] gap-2 border-b border-slate-100 py-1.5 text-xs sm:text-sm">
      <dt className="font-medium text-slate-600">{label}</dt>
      <dd className="text-slate-800">{value ?? "-"}</dd>
    </div>
  );
}

export function ManagedStudentsWithTabs({
  onStudentSelect,
  hideInternalJournal = false,
}: {
  onStudentSelect?: (studentId: string | null) => void;
  hideInternalJournal?: boolean;
}) {
  const currentUser = useMemo(
    () =>
      ({
        role: "담임" as ObservationRole,
        author: "로그인 사용자",
      }) satisfies { role: ObservationRole; author: string },
    [],
  );
  const studentById = useMemo(
    () => Object.fromEntries(managedStudents.map((s) => [s.id, s])),
    [],
  );

  const [openJournalIds, setOpenJournalIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"list" | string>("list");

  const [observationsByStudent, setObservationsByStudent] = useState<
    Record<string, ObservationEntry[]>
  >(() => {
    const seed: Record<string, ObservationEntry[]> = {};
    for (const s of managedStudents) {
      seed[s.id] = getObservationsForStudent(s.id);
    }
    return seed;
  });

  const counselTemplate = useMemo(
    () => `상담 장소: \n\n내용: \n\n특이사항: `,
    [],
  );
  const [draftContent, setDraftContent] = useState(counselTemplate);
  const [draftTag, setDraftTag] = useState("");
  const [draftVisibility, setDraftVisibility] = useState<
    ObservationEntry["visibility"]
  >("public");
  function openStudentJournal(studentId: string) {
    onStudentSelect?.(studentId);
    if (hideInternalJournal) return;
    setOpenJournalIds((prev) =>
      prev.includes(studentId) ? prev : [...prev, studentId],
    );
    setActiveTab(studentId);
  }

  function closeJournalTab(studentId: string, e: React.MouseEvent) {
    e.stopPropagation();
    setOpenJournalIds((prev) => prev.filter((id) => id !== studentId));
    if (activeTab === studentId) {
      setActiveTab("list");
      onStudentSelect?.(null);
    }
  }

  const activeStudent =
    activeTab !== "list" ? studentById[activeTab] : undefined;
  const activeObservations =
    activeTab !== "list" ? (observationsByStudent[activeTab] ?? []) : [];
  const activeStudentApplicationJson =
    activeTab !== "list" ? studentApplicationDetailsById[activeTab] : undefined;
  const activeApplicationInfo =
    (activeStudentApplicationJson as
      | {
          전체데이터?: {
            학생맞춤통합지원_신청서?: {
              대상학생_정보?: {
                성명?: string;
                생년월일?: string;
                성별?: string;
                거주지역?: string;
                학교급?: string;
                학년?: string;
              };
              학생_기본사항?: {
                기초수급_보장현황?: string[];
                가족현황?: string[];
                학생현황?: string[];
              };
              학생_어려움?: {
                학업?: string[];
                심리_정서?: string[];
                돌봄_안전_건강?: string[];
                경제_생활?: string[];
                기타?: string;
              };
              신청_사유?: string[];
              지원_요청_사항?: string[];
            };
          };
        }
      | undefined)?.전체데이터?.학생맞춤통합지원_신청서;
  const useExternalJournalPanel = Boolean(onStudentSelect);

  const tabBarBg = "bg-[#dde6f0]";

  const tabBase =
    "max-w-[268px] shrink-0 truncate rounded-t-xl px-3.5 py-2 text-left text-sm leading-snug " +
    "transition-[color,background-color] duration-150 ease-out " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003876]/45 " +
    "focus-visible:ring-offset-2 focus-visible:ring-offset-[#dde6f0] sm:max-w-[308px]";

  return (
    <section className="overflow-hidden border border-slate-300/80 bg-white">
      {!hideInternalJournal && (
        <div
          className={`flex flex-nowrap items-end gap-1 overflow-x-auto overflow-y-visible px-1 pt-1 pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${tabBarBg}`}
          role="tablist"
          aria-label="관리 학생 및 관찰 및 상담 일지"
        >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "list"}
          onClick={() => {
            setActiveTab("list");
            onStudentSelect?.(null);
          }}
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
                onClick={() => {
                  setActiveTab(sid);
                  onStudentSelect?.(sid);
                }}
                className={`flex min-w-0 flex-1 items-center truncate px-3.5 py-2 text-left text-sm leading-snug transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003876]/45 focus-visible:ring-inset ${
                  selected ? "font-semibold text-slate-900" : ""
                }`}
              >
                {s.name} · 관찰 및 상담 일지
              </button>
              <button
                type="button"
                className={`flex w-8 shrink-0 items-center justify-center self-stretch transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003876]/45 focus-visible:ring-inset ${
                  selected
                    ? "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    : "text-slate-400/90 hover:bg-black/[0.07] hover:text-slate-800"
                }`}
                aria-label={`${s.name} 관찰 및 상담 일지 탭 닫기`}
                onClick={(e) => closeJournalTab(sid, e)}
              >
                <X className="size-4 shrink-0" strokeWidth={2.25} aria-hidden />
              </button>
            </div>
          );
        })}
        </div>
      )}

      <div className="-mt-px bg-white" role="tabpanel">
        {hideInternalJournal || activeTab === "list" ? (
          <>
            <div className="border-b border-slate-100 px-5 py-3">
              <p className="text-xs text-slate-500">
                행을 선택하면 관찰 및 상담 일지 탭이 열립니다. 총{" "}
                {managedStudents.length}명(목업).
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-medium text-slate-500">
                    <th className="px-5 py-3">이름</th>
                    <th className="px-5 py-3">학년</th>
                    <th className="px-5 py-3">반</th>
                    <th className="px-5 py-3">상태</th>
                    <th className="px-5 py-3">최근 갱신</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {managedStudents.map((row) => {
                    const { gradeLabel, classLabel } = splitGradeClassDisplay(row.gradeClass);
                    return (
                      <tr
                        key={row.id}
                        title={managedStudentSummaryLine(row)}
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
                        <td className="px-5 py-3 text-slate-600">{gradeLabel}</td>
                        <td className="px-5 py-3 text-slate-600">{classLabel}</td>
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
                    · {activeStudent.gradeClass}
                  </span>
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  관찰 및 상담 일지 · 공동 작성(목업)
                </p>
              </div>
              {activeApplicationInfo && (
                <div className="border-b border-slate-100 bg-slate-50/60 px-5 py-4">
                  <div className="grid gap-3 lg:grid-cols-2">
                    <section className="rounded-md border border-slate-200 bg-white p-3">
                      <h3 className="text-xs font-semibold text-slate-700">기본 정보</h3>
                      <dl className="mt-1">
                        <DetailRow label="학생 이름" value={activeApplicationInfo.대상학생_정보?.성명} />
                        <DetailRow label="학년" value={activeApplicationInfo.대상학생_정보?.학년} />
                        <DetailRow label="학교급" value={activeApplicationInfo.대상학생_정보?.학교급} />
                        <DetailRow label="성별" value={activeApplicationInfo.대상학생_정보?.성별} />
                        <DetailRow label="생년월일" value={activeApplicationInfo.대상학생_정보?.생년월일} />
                        <DetailRow label="거주지역" value={activeApplicationInfo.대상학생_정보?.거주지역} />
                        <DetailRow
                          label="기초수급보장현황"
                          value={activeApplicationInfo.학생_기본사항?.기초수급_보장현황?.join(", ")}
                        />
                        <DetailRow
                          label="가족현황"
                          value={activeApplicationInfo.학생_기본사항?.가족현황?.join(", ")}
                        />
                        <DetailRow
                          label="학생현황"
                          value={activeApplicationInfo.학생_기본사항?.학생현황?.join(", ")}
                        />
                      </dl>
                    </section>

                    <section className="rounded-md border border-slate-200 bg-white p-3">
                      <h3 className="text-xs font-semibold text-slate-700">주요 어려움</h3>
                      <dl className="mt-1">
                        <DetailRow label="학업" value={activeApplicationInfo.학생_어려움?.학업?.join(", ")} />
                        <DetailRow
                          label="심리·정서"
                          value={activeApplicationInfo.학생_어려움?.심리_정서?.join(", ")}
                        />
                        <DetailRow
                          label="돌봄·안전·건강"
                          value={activeApplicationInfo.학생_어려움?.돌봄_안전_건강?.join(", ")}
                        />
                        <DetailRow
                          label="경제·생활"
                          value={activeApplicationInfo.학생_어려움?.경제_생활?.join(", ")}
                        />
                        <DetailRow label="기타" value={activeApplicationInfo.학생_어려움?.기타} />
                      </dl>
                    </section>
                  </div>

                  <div className="mt-3 grid gap-3 lg:grid-cols-2">
                    <section className="rounded-md border border-slate-200 bg-white p-3">
                      <h3 className="text-xs font-semibold text-slate-700">신청 사유</h3>
                      <p className="mt-1 text-xs leading-relaxed text-slate-700 sm:text-sm">
                        {activeApplicationInfo.신청_사유?.join(" / ") ?? "-"}
                      </p>
                    </section>
                    <section className="rounded-md border border-slate-200 bg-white p-3">
                      <h3 className="text-xs font-semibold text-slate-700">지원 요청 사항</h3>
                      <p className="mt-1 text-xs leading-relaxed text-slate-700 sm:text-sm">
                        {activeApplicationInfo.지원_요청_사항?.join(" / ") ?? "-"}
                      </p>
                    </section>
                  </div>
                </div>
              )}
              {!useExternalJournalPanel && (
                <>
                  <div className="border-b border-slate-100 px-5 py-4">
                    <form
                      className="grid gap-3"
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!activeStudent) return;
                        const content = draftContent.trim();
                        if (!content) return;

                        const tags = draftTag ? [draftTag] : [];

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
                          [activeStudent.id]: [...(prev[activeStudent.id] ?? []), entry],
                        }));
                        setDraftContent(counselTemplate);
                        setDraftTag("");
                        setDraftVisibility("public");
                      }}
                    >
                      <div className="grid gap-3 sm:grid-cols-12 sm:items-end">
                        <label className="grid gap-1 sm:col-span-7">
                          <span className="text-xs font-medium text-slate-600">
                            태그(선택)
                          </span>
                          <select
                            value={draftTag}
                            onChange={(e) => setDraftTag(e.target.value)}
                            aria-label="태그 선택"
                            className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-[#003876]/35"
                          >
                            <option value="">태그 선택</option>
                            {observationTagOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
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
                          rows={7}
                          placeholder={`상담 장소/내용/특이사항을 입력해 주세요.\n\n${counselTemplate}`}
                          className="min-h-[220px] resize-y rounded-md border border-slate-200 bg-white px-3 py-2 text-sm leading-relaxed text-slate-800 shadow-sm outline-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#003876]/35"
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
                  <ObservationTimeline items={activeObservations} />
                </>
              )}
            </>
          )
        )}
      </div>
    </section>
  );
}
