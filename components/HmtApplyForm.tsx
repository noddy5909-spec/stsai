"use client";

import Link from "next/link";
import { useCallback, useState, type Dispatch, type SetStateAction } from "react";

type CheckState = Record<string, boolean>;

const basicSupportOptions = [
  { id: "basic_livelihood", label: "기초생활수급자" },
  { id: "legal_single_parent", label: "법정한부모" },
  { id: "near_poverty", label: "법정차상위" },
  { id: "other_low_income", label: "기타 저소득" },
] as const;

const familyOptions = [
  { id: "fam_parents", label: "부모" },
  { id: "fam_single", label: "한부모(부/모)" },
  { id: "fam_grand", label: "조부모(조부/조모)" },
  { id: "fam_head_minor", label: "소년소녀가장" },
  { id: "fam_relative", label: "친척" },
  { id: "fam_facility", label: "시설 또는 쉼터" },
  { id: "fam_care_child", label: "가족돌봄 아동청소년" },
] as const;

const studentStatusOptions = [
  { id: "stu_multicultural", label: "다문화" },
  { id: "stu_special", label: "특수교육대상자" },
  { id: "stu_nk", label: "북한이탈주민보호대상자" },
  { id: "stu_refugee", label: "난민인정자" },
] as const;

const difficultyAcademic = [
  { id: "acd_basic", label: "기초학습 부족" },
  { id: "acd_subject", label: "교과 부족" },
  { id: "acd_drop", label: "학업 중단 위기" },
] as const;

const difficultyMental = [
  { id: "men_depress", label: "우울" },
  { id: "men_anxiety", label: "불안" },
  { id: "men_adhd", label: "ADHD(주의력결핍 과잉행동장애)" },
  { id: "men_apathy", label: "무기력" },
  { id: "men_anger", label: "분노/폭력" },
] as const;

const difficultyCare = [
  { id: "car_abuse", label: "학대(방임)" },
  { id: "car_meal", label: "결식" },
  { id: "car_guardian_shock", label: "급작스러운 보호자 사망, 이혼, 실직 등" },
  { id: "car_parent_env", label: "부모의 양육 환경(알코올중독, 장애 등)" },
  { id: "car_self_harm", label: "자해 및 자살 시도" },
  { id: "car_school_v", label: "학교폭력" },
  { id: "car_sexual", label: "성폭력" },
  { id: "car_disease", label: "질병" },
  { id: "car_obesity", label: "비만" },
] as const;

const difficultyEcon = [{ id: "eco_hard", label: "경제적 어려움" }] as const;

function CheckboxGrid({
  options,
  state,
  onToggle,
  otherKey,
  otherValue,
  onOtherChange,
  columns = 3,
}: {
  options: readonly { id: string; label: string }[];
  state: CheckState;
  onToggle: (id: string) => void;
  otherKey?: string;
  otherValue?: string;
  onOtherChange?: (v: string) => void;
  /** 2: 좁은 그룹, 3: 기본, 4: 돌봄 등 항목 많을 때 */
  columns?: 2 | 3 | 4;
}) {
  const colClass =
    columns === 4
      ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      : columns === 2
        ? "sm:grid-cols-2"
        : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <div className={`grid gap-x-3 gap-y-1 ${colClass}`}>
      {options.map((o) => (
        <label
          key={o.id}
          className="flex cursor-pointer items-start gap-2 rounded border border-transparent py-0.5 pr-1 hover:bg-slate-50"
        >
          <input
            type="checkbox"
            checked={!!state[o.id]}
            onChange={() => onToggle(o.id)}
            className="mt-0.5 shrink-0"
          />
          <span className="text-xs leading-snug text-slate-800 sm:text-sm">{o.label}</span>
        </label>
      ))}
      {otherKey && onOtherChange !== undefined && (
        <label
          className={`flex flex-wrap items-center gap-2 py-0.5 sm:col-span-2 ${
            columns === 4 ? "xl:col-span-4" : columns === 3 ? "lg:col-span-3" : ""
          }`}
        >
          <input
            type="checkbox"
            checked={!!state[otherKey]}
            onChange={() => onToggle(otherKey)}
            className="mt-0.5 shrink-0"
          />
          <span className="text-sm text-slate-800">기타</span>
          <input
            type="text"
            value={otherValue ?? ""}
            onChange={(e) => onOtherChange(e.target.value)}
            placeholder="기타 내용"
            disabled={!state[otherKey]}
            className="min-w-[8rem] flex-1 border border-slate-200 px-2 py-1 text-sm disabled:bg-slate-100"
          />
        </label>
      )}
    </div>
  );
}

export function HmtApplyForm() {
  const [applicantName, setApplicantName] = useState("");
  const [applicantTitle, setApplicantTitle] = useState("");
  const [relationToStudent, setRelationToStudent] = useState("");

  const [studentName, setStudentName] = useState("");
  const [gradeClass, setGradeClass] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<"" | "male" | "female">("");
  const [phoneStudent, setPhoneStudent] = useState("");
  const [phoneGuardian, setPhoneGuardian] = useState("");
  const [address, setAddress] = useState("");

  const [basicSupport, setBasicSupport] = useState<CheckState>({});
  const [family, setFamily] = useState<CheckState>({});
  const [familyOtherDetail, setFamilyOtherDetail] = useState("");
  const [studentStatus, setStudentStatus] = useState<CheckState>({});
  const [studentStatusOther, setStudentStatusOther] = useState("");

  const [diffAcademic, setDiffAcademic] = useState<CheckState>({});
  const [diffAcademicOther, setDiffAcademicOther] = useState("");
  const [diffMental, setDiffMental] = useState<CheckState>({});
  const [diffMentalOther, setDiffMentalOther] = useState("");
  const [diffCare, setDiffCare] = useState<CheckState>({});
  const [diffCareOther, setDiffCareOther] = useState("");
  const [diffEcon, setDiffEcon] = useState<CheckState>({});
  const [diffEconOther, setDiffEconOther] = useState("");
  const [diffOther, setDiffOther] = useState("");

  const [applyReason, setApplyReason] = useState("");
  const [supportRequest, setSupportRequest] = useState("");

  const [applyYear, setApplyYear] = useState("");
  const [applyMonth, setApplyMonth] = useState("");
  const [applyDay, setApplyDay] = useState("");
  const [signature, setSignature] = useState("");

  const toggle = useCallback((setter: Dispatch<SetStateAction<CheckState>>) => {
    return (id: string) =>
      setter((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const [savedToast, setSavedToast] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleSaveDraft = () => {
    setSavedToast(true);
    window.setTimeout(() => setSavedToast(false), 2000);
  };

  const inputCls =
    "border border-slate-200 px-2.5 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003876]/30";

  return (
    <div className="mx-auto max-w-7xl space-y-4">
      <div>
        <h1 className="text-xl font-bold text-[#003876]">학맞통 신청</h1>
        <p className="mt-1 max-w-4xl text-sm text-slate-500">
          학생맞춤통합지원 신청서(교직원→교내 협의체) 전자 입력. 저장·전송은 목업입니다.
        </p>
      </div>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSaveDraft();
        }}
      >
        <section className="border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-100 bg-slate-50/90 px-4 py-2">
            <h2 className="text-sm font-semibold text-slate-900">
              신청자 · 대상 학생
            </h2>
          </header>
          <div className="grid gap-0 lg:grid-cols-2 lg:divide-x lg:divide-slate-200">
            <div className="space-y-3 p-4">
              <p className="text-xs font-semibold text-slate-600">신청자</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <label className="grid gap-0.5">
                  <span className="text-xs text-slate-600">신청자명</span>
                  <input
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className={inputCls}
                  />
                </label>
                <label className="grid gap-0.5">
                  <span className="text-xs text-slate-600">직위</span>
                  <input
                    value={applicantTitle}
                    onChange={(e) => setApplicantTitle(e.target.value)}
                    className={inputCls}
                  />
                </label>
                <label className="grid gap-0.5 sm:col-span-3 lg:col-span-1">
                  <span className="text-xs text-slate-600">학생과의 관계</span>
                  <input
                    value={relationToStudent}
                    onChange={(e) => setRelationToStudent(e.target.value)}
                    className={inputCls}
                  />
                </label>
              </div>
            </div>
            <div className="space-y-3 p-4">
              <p className="text-xs font-semibold text-slate-600">대상 학생</p>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
                <label className="col-span-2 grid gap-0.5 md:col-span-2">
                  <span className="text-xs text-slate-600">성명</span>
                  <input
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className={inputCls}
                  />
                </label>
                <label className="col-span-2 grid gap-0.5 md:col-span-2">
                  <span className="text-xs text-slate-600">학년/반</span>
                  <input
                    value={gradeClass}
                    onChange={(e) => setGradeClass(e.target.value)}
                    placeholder="고1 3반"
                    className={inputCls}
                  />
                </label>
                <label className="col-span-2 grid gap-0.5 md:col-span-2">
                  <span className="text-xs text-slate-600">생년월일</span>
                  <input
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    placeholder="YYYY-MM-DD"
                    className={inputCls}
                  />
                </label>
                <fieldset className="col-span-2 flex flex-wrap items-center gap-3 md:col-span-2">
                  <legend className="sr-only">성별</legend>
                  <span className="w-full text-xs text-slate-600">성별</span>
                  <label className="flex items-center gap-1.5 text-sm">
                    <input
                      type="radio"
                      name="gender"
                      checked={gender === "male"}
                      onChange={() => setGender("male")}
                    />
                    남
                  </label>
                  <label className="flex items-center gap-1.5 text-sm">
                    <input
                      type="radio"
                      name="gender"
                      checked={gender === "female"}
                      onChange={() => setGender("female")}
                    />
                    여
                  </label>
                </fieldset>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="grid gap-0.5">
                  <span className="text-xs text-slate-600">연락처(학생)</span>
                  <input
                    value={phoneStudent}
                    onChange={(e) => setPhoneStudent(e.target.value)}
                    placeholder="000-0000-0000"
                    className={inputCls}
                  />
                </label>
                <label className="grid gap-0.5">
                  <span className="text-xs text-slate-600">연락처(보호자)</span>
                  <input
                    value={phoneGuardian}
                    onChange={(e) => setPhoneGuardian(e.target.value)}
                    placeholder="000-0000-0000(모)"
                    className={inputCls}
                  />
                </label>
              </div>
              <label className="grid gap-0.5">
                <span className="text-xs text-slate-600">주소</span>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={inputCls}
                />
              </label>
            </div>
          </div>
        </section>

        <section className="border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-100 bg-slate-50/90 px-4 py-2">
            <h2 className="text-sm font-semibold text-slate-900">학생 기본사항</h2>
            <p className="text-xs text-slate-500">해당 시 체크 · 중복 가능</p>
          </header>
          <div className="grid gap-4 p-4 lg:grid-cols-3 lg:gap-0 lg:divide-x lg:divide-slate-200">
            <fieldset className="space-y-2 lg:pr-4">
              <legend className="text-xs font-semibold text-slate-700">
                기초수급 보장현황
              </legend>
              <CheckboxGrid
                columns={2}
                options={basicSupportOptions}
                state={basicSupport}
                onToggle={toggle(setBasicSupport)}
              />
            </fieldset>
            <fieldset className="space-y-2 lg:px-4">
              <legend className="text-xs font-semibold text-slate-700">가족현황</legend>
              <CheckboxGrid
                columns={2}
                options={familyOptions}
                state={family}
                onToggle={toggle(setFamily)}
                otherKey="fam_other"
                otherValue={familyOtherDetail}
                onOtherChange={setFamilyOtherDetail}
              />
            </fieldset>
            <fieldset className="space-y-2 lg:pl-4">
              <legend className="text-xs font-semibold text-slate-700">학생현황</legend>
              <CheckboxGrid
                columns={2}
                options={studentStatusOptions}
                state={studentStatus}
                onToggle={toggle(setStudentStatus)}
                otherKey="stu_other"
                otherValue={studentStatusOther}
                onOtherChange={setStudentStatusOther}
              />
            </fieldset>
          </div>
        </section>

        <section className="border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-100 bg-slate-50/90 px-4 py-2">
            <h2 className="text-sm font-semibold text-slate-900">학생 어려움</h2>
            <p className="text-xs text-slate-500">해당 시 체크 · 중복 가능</p>
          </header>
          <div className="grid gap-4 p-4 xl:grid-cols-2 xl:gap-0 xl:divide-x xl:divide-slate-200">
            <div className="space-y-4 xl:pr-4">
              <fieldset className="space-y-2">
                <legend className="text-xs font-semibold text-slate-700">학업</legend>
                <CheckboxGrid
                  columns={3}
                  options={difficultyAcademic}
                  state={diffAcademic}
                  onToggle={toggle(setDiffAcademic)}
                  otherKey="acd_other"
                  otherValue={diffAcademicOther}
                  onOtherChange={setDiffAcademicOther}
                />
              </fieldset>
              <fieldset className="space-y-2">
                <legend className="text-xs font-semibold text-slate-700">심리·정서</legend>
                <CheckboxGrid
                  columns={3}
                  options={difficultyMental}
                  state={diffMental}
                  onToggle={toggle(setDiffMental)}
                  otherKey="men_other"
                  otherValue={diffMentalOther}
                  onOtherChange={setDiffMentalOther}
                />
              </fieldset>
              <fieldset className="space-y-2">
                <legend className="text-xs font-semibold text-slate-700">경제·생활</legend>
                <CheckboxGrid
                  columns={2}
                  options={difficultyEcon}
                  state={diffEcon}
                  onToggle={toggle(setDiffEcon)}
                  otherKey="eco_other"
                  otherValue={diffEconOther}
                  onOtherChange={setDiffEconOther}
                />
              </fieldset>
            </div>
            <div className="space-y-4 xl:pl-4">
              <fieldset className="space-y-2">
                <legend className="text-xs font-semibold text-slate-700">
                  돌봄·안전·건강
                </legend>
                <CheckboxGrid
                  columns={4}
                  options={difficultyCare}
                  state={diffCare}
                  onToggle={toggle(setDiffCare)}
                  otherKey="car_other"
                  otherValue={diffCareOther}
                  onOtherChange={setDiffCareOther}
                />
              </fieldset>
              <label className="grid gap-0.5">
                <span className="text-xs font-semibold text-slate-700">기타(자유기술)</span>
                <textarea
                  value={diffOther}
                  onChange={(e) => setDiffOther(e.target.value)}
                  rows={2}
                  className={inputCls}
                />
              </label>
            </div>
          </div>
        </section>

        <section className="border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-2 lg:divide-x lg:divide-slate-200">
            <div>
              <header className="border-b border-slate-100 bg-slate-50/90 px-4 py-2">
                <h2 className="text-sm font-semibold text-slate-900">신청 사유</h2>
                <p className="text-xs text-slate-500">
                  ※ 어려움 체크를 중심으로 설명
                </p>
              </header>
              <div className="p-4">
                <textarea
                  value={applyReason}
                  onChange={(e) => setApplyReason(e.target.value)}
                  rows={4}
                  className={`${inputCls} min-h-[7rem] w-full resize-y`}
                />
              </div>
            </div>
            <div>
              <header className="border-b border-slate-100 bg-slate-50/90 px-4 py-2">
                <h2 className="text-sm font-semibold text-slate-900">지원 요청 사항</h2>
              </header>
              <div className="p-4">
                <textarea
                  value={supportRequest}
                  onChange={(e) => setSupportRequest(e.target.value)}
                  rows={4}
                  className={`${inputCls} min-h-[7rem] w-full resize-y`}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="border border-slate-200 bg-white shadow-sm">
          <div className="space-y-3 p-4">
            <p className="text-sm font-medium text-slate-800">
              위 학생을 학생맞춤통합지원 대상 학생으로 신청합니다.
            </p>
            <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-end md:justify-between">
              <div className="flex flex-wrap items-end gap-2">
                <label className="grid gap-0.5">
                  <span className="text-xs text-slate-600">년</span>
                  <input
                    value={applyYear}
                    onChange={(e) => setApplyYear(e.target.value)}
                    placeholder="20"
                    className={`${inputCls} w-16`}
                  />
                </label>
                <span className="pb-2 text-slate-400">.</span>
                <label className="grid gap-0.5">
                  <span className="text-xs text-slate-600">월</span>
                  <input
                    value={applyMonth}
                    onChange={(e) => setApplyMonth(e.target.value)}
                    className={`${inputCls} w-14`}
                  />
                </label>
                <span className="pb-2 text-slate-400">.</span>
                <label className="grid gap-0.5">
                  <span className="text-xs text-slate-600">일</span>
                  <input
                    value={applyDay}
                    onChange={(e) => setApplyDay(e.target.value)}
                    className={`${inputCls} w-14`}
                  />
                </label>
              </div>
              <label className="grid min-w-[12rem] flex-1 gap-0.5 md:max-w-sm">
                <span className="text-xs font-medium text-slate-600">
                  신청자 (서명 또는 성명)
                </span>
                <input
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  className={inputCls}
                />
              </label>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              ※ 학기초 개인정보의 수집·이용·제공 고지, 일괄 동의 안내 시
              학생맞춤통합지원도 포함하여 진행
            </p>
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            임시 저장(목업)
          </button>
          <button
            type="submit"
            className="border border-[#003876] bg-[#003876] px-4 py-2 text-sm font-semibold text-white hover:bg-[#002d5c]"
          >
            제출(목업)
          </button>
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
          >
            신청서 미리보기
          </button>
          <Link
            href="/exchange"
            className="ml-auto text-sm text-[#003876] underline underline-offset-2 hover:text-[#002d5c]"
          >
            AI 추천·일지(통합지원신청)
          </Link>
        </div>
      </form>

      {showPreview && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="preview-title"
        >
          <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto border border-slate-200 bg-white p-5 shadow-lg">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <h2 id="preview-title" className="text-base font-semibold text-[#003876]">
                신청서 미리보기(목업)
              </h2>
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="shrink-0 border border-slate-300 px-2 py-1 text-xs hover:bg-slate-50"
              >
                닫기
              </button>
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <div>
                <dt className="text-xs font-semibold text-slate-500">신청자</dt>
                <dd className="text-slate-800">
                  {applicantName || "—"} / {applicantTitle || "—"} /{" "}
                  {relationToStudent || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-slate-500">학생</dt>
                <dd className="text-slate-800">
                  {studentName || "—"} · {gradeClass || "—"} · {birthDate || "—"} ·{" "}
                  {gender === "male" ? "남" : gender === "female" ? "여" : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-slate-500">신청 사유</dt>
                <dd className="whitespace-pre-wrap text-slate-700">
                  {applyReason || "(미입력)"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-slate-500">지원 요청</dt>
                <dd className="whitespace-pre-wrap text-slate-700">
                  {supportRequest || "(미입력)"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-slate-500">날짜·서명</dt>
                <dd className="text-slate-800">
                  {applyYear || "—"}.{applyMonth || "—"}.{applyDay || "—"} /{" "}
                  {signature || "—"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}

      {savedToast && (
        <div
          className="fixed bottom-4 right-4 z-50 border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-800 shadow-md"
          role="status"
        >
          임시 저장되었습니다(브라우저 목업).
        </div>
      )}
    </div>
  );
}
