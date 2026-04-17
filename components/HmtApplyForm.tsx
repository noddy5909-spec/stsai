"use client";

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
  compact,
}: {
  options: readonly { id: string; label: string }[];
  state: CheckState;
  onToggle: (id: string) => void;
  otherKey?: string;
  otherValue?: string;
  onOtherChange?: (v: string) => void;
  columns?: 2 | 3 | 4;
  compact?: boolean;
}) {
  const colClass =
    columns === 4
      ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      : columns === 2
        ? "sm:grid-cols-2"
        : "sm:grid-cols-2 lg:grid-cols-3";
  const labelCls = compact
    ? "flex cursor-pointer items-start gap-1 py-[1px] pr-0.5"
    : "flex cursor-pointer items-start gap-1.5 rounded border border-transparent py-[1px] pr-1 hover:bg-slate-50";
  const textCls = compact
    ? "text-[10px] leading-tight text-slate-900 sm:text-[11px]"
    : "text-[11px] leading-tight text-slate-800 sm:text-xs";
  return (
    <div className={`grid gap-x-2 gap-y-0.5 ${colClass}`}>
      {options.map((o) => (
        <label key={o.id} className={labelCls}>
          <input
            type="checkbox"
            checked={!!state[o.id]}
            onChange={() => onToggle(o.id)}
            className="mt-0.5 size-3.5 shrink-0 accent-slate-900 sm:size-4"
          />
          <span className={textCls}>{o.label}</span>
        </label>
      ))}
      {otherKey && onOtherChange !== undefined && (
        <label
          className={`flex flex-wrap items-center gap-1.5 py-0.5 sm:col-span-2 ${
            columns === 4 ? "xl:col-span-4" : columns === 3 ? "lg:col-span-3" : ""
          }`}
        >
          <input
            type="checkbox"
            checked={!!state[otherKey]}
            onChange={() => onToggle(otherKey)}
            className="mt-0.5 size-3.5 shrink-0 accent-slate-900 sm:size-4"
          />
          <span className={textCls}>기타(</span>
          <input
            type="text"
            value={otherValue ?? ""}
            onChange={(e) => onOtherChange(e.target.value)}
            placeholder=""
            disabled={!state[otherKey]}
            className="min-w-[6rem] flex-1 border-b border-slate-400 bg-transparent px-0.5 py-0.5 text-center text-xs disabled:opacity-50 sm:min-w-[8rem] sm:text-sm"
          />
          <span className={textCls}>)</span>
        </label>
      )}
    </div>
  );
}

/** PDF「학생맞춤통합지원 신청서(학교)」테두리·셀 스타일 */
const sheet = {
  wrap: "max-sm:-mx-1 max-sm:overflow-x-auto",
  table:
    "w-full min-w-0 table-fixed border-collapse border border-slate-900 bg-white text-slate-900 [&_td]:border-slate-900 [&_th]:border-slate-900",
  titleRow: "border border-slate-900 bg-white px-2 py-2 text-center text-[13px] font-bold leading-snug sm:text-sm",
  td: "border border-slate-900 p-1 align-top text-[10px] leading-tight sm:p-1.5 sm:text-[11px] sm:leading-snug",
  /** 상단 6열 표 — 라벨 */
  thTop:
    "border border-slate-900 bg-slate-50 p-1 text-center text-[10px] font-medium break-keep sm:p-1.5 sm:text-[11px] align-middle w-[4.7rem] sm:w-[5.3rem]",
  /** 구분 열(기초수급·학업 등) */
  thCat:
    "border border-slate-900 bg-slate-50 p-1 text-center text-[10px] font-medium break-keep sm:p-1.5 sm:text-[11px] align-middle w-[5.1rem] sm:w-[6rem]",
  thCatHead:
    "border border-slate-900 bg-slate-50 p-1 text-center text-[10px] font-semibold break-keep sm:p-1.5 sm:text-[11px] align-middle w-[5.1rem] sm:w-[6rem]",
  thItemHead:
    "border border-slate-900 bg-slate-50 p-1 text-center text-[10px] font-semibold sm:p-1.5 sm:text-[11px] align-middle min-w-0",
  /** 세로 블록 제목: 학생 기본사항 / 학생 어려움 */
  thSection:
    "border border-slate-900 bg-slate-50 px-0.5 py-1.5 text-center align-middle text-[10px] font-bold leading-tight text-slate-900 sm:w-fit sm:px-1 sm:py-2.5 sm:text-[11px] writing-vertical-rl w-[5.1rem]",
  thReason:
    "border border-slate-900 bg-slate-50 p-1 text-center text-[10px] font-medium break-keep sm:p-1.5 sm:text-[11px] align-middle w-[7.15rem] sm:w-[8.35rem]",
} as const;

const fieldLine =
  "w-full min-h-[1.35rem] border-0 border-b border-slate-700 bg-transparent py-0 text-center text-[11px] leading-tight focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#003876]/50 sm:text-xs";
const areaField =
  "min-h-[4.6rem] w-full resize-y border border-slate-600 p-1.5 text-[11px] leading-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003876]/30 sm:text-xs";

export function HmtApplyForm() {
  const [applicantName, setApplicantName] = useState("");
  const [applicantTitle, setApplicantTitle] = useState("");
  const [relationToStudent, setRelationToStudent] = useState("");

  const [studentName, setStudentName] = useState("");
  const [gradeYear, setGradeYear] = useState("");
  const [classRoom, setClassRoom] = useState("");
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

  return (
    <div className="mx-auto max-w-4xl space-y-4 print:max-w-none">
      <div className="print:hidden">
        <h1 className="text-xl font-bold text-[#003876]">학맞통 신청</h1>
        <p className="mt-1 text-sm text-slate-500">
          아래 서식은「학생맞춤통합지원 신청서(학교)」PDF와 동일한 항목·순서입니다. 저장·전송은 목업입니다.
        </p>
      </div>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSaveDraft();
        }}
      >
        <article
          className="border-2 border-slate-900 bg-white shadow-sm print:border-slate-900 print:shadow-none"
          aria-label="학생맞춤통합지원 신청서"
        >
          <div className={sheet.wrap}>
            {/* PDF 1페이지: 제목 + 신청자·학생 + 연락처·주소 (6열) */}
            <table className={`${sheet.table} min-w-[56rem]`}>
              <caption className="sr-only">
                학생맞춤통합지원 신청서 교직원에서 교내 협의체로 제출
              </caption>
              <colgroup>
                <col className="w-[6rem]" />
                <col />
                <col className="w-[6rem]" />
                <col />
                <col className="w-[6rem]" />
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th className={sheet.titleRow} colSpan={6} scope="colgroup">
                    학생맞춤통합지원 신청서(교(직)원→교내 협의체(위원회 또는 팀))
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th className={sheet.thTop} scope="row">
                    신청자명
                  </th>
                  <td className={sheet.td}>
                    <input
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className={fieldLine}
                      autoComplete="name"
                    />
                  </td>
                  <th className={sheet.thTop} scope="row">
                    직위
                  </th>
                  <td className={sheet.td}>
                    <input
                      value={applicantTitle}
                      onChange={(e) => setApplicantTitle(e.target.value)}
                      className={fieldLine}
                    />
                  </td>
                  <th className={sheet.thTop} scope="row">
                    학생과의 관계
                  </th>
                  <td className={sheet.td}>
                    <input
                      value={relationToStudent}
                      onChange={(e) => setRelationToStudent(e.target.value)}
                      className={fieldLine}
                    />
                  </td>
                </tr>
                <tr>
                  <th className={sheet.thTop} scope="row">
                    성명
                    <br />
                    <span className="font-normal">(대상학생)</span>
                  </th>
                  <td className={sheet.td}>
                    <input
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className={fieldLine}
                    />
                  </td>
                  <th className={sheet.thTop} scope="row">
                    학년
                  </th>
                  <td className={sheet.td}>
                    <input
                      value={gradeYear}
                      onChange={(e) => setGradeYear(e.target.value)}
                      placeholder="예: 고1"
                      className={fieldLine}
                      aria-label="학년"
                    />
                  </td>
                  <th className={sheet.thTop} scope="row">
                    반
                  </th>
                  <td className={sheet.td}>
                    <input
                      value={classRoom}
                      onChange={(e) => setClassRoom(e.target.value)}
                      placeholder="예: 3"
                      className={fieldLine}
                      aria-label="반"
                    />
                  </td>
                </tr>
                <tr>
                  <th className={sheet.thTop} scope="row">
                    생년월일
                  </th>
                  <td className={sheet.td} colSpan={5}>
                    <input
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      placeholder="YYYY-MM-DD"
                      className={fieldLine}
                    />
                  </td>
                </tr>
                <tr>
                  <th className={sheet.thTop} scope="row">
                    성별
                  </th>
                  <td className={sheet.td} colSpan={5}>
                    <fieldset className="flex flex-wrap items-center gap-2.5 border-0 p-0 sm:gap-4">
                      <legend className="sr-only">성별</legend>
                      <label className="flex items-center gap-1.5 text-sm">
                        <input
                          type="radio"
                          name="gender"
                          checked={gender === "male"}
                          onChange={() => setGender("male")}
                          className="size-3.5 accent-slate-900"
                        />
                        남
                      </label>
                      <label className="flex items-center gap-1.5 text-sm">
                        <input
                          type="radio"
                          name="gender"
                          checked={gender === "female"}
                          onChange={() => setGender("female")}
                          className="size-3.5 accent-slate-900"
                        />
                        여
                      </label>
                    </fieldset>
                  </td>
                </tr>
                <tr>
                  <th className={sheet.thTop} rowSpan={2} scope="rowgroup">
                    연락처
                  </th>
                  <td className={`${sheet.td} text-center font-medium`} scope="row">
                    학생
                  </td>
                  <td className={sheet.td} colSpan={2}>
                    <input
                      value={phoneStudent}
                      onChange={(e) => setPhoneStudent(e.target.value)}
                      placeholder="000-0000-0000"
                      className={`${fieldLine} inline-block w-[min(100%,11.5rem)] sm:w-56`}
                    />
                  </td>
                  <th className={sheet.thTop} rowSpan={2} scope="rowgroup">
                    주소
                  </th>
                  <td className={sheet.td} rowSpan={2}>
                    <span className="mb-1 block font-medium">학생</span>
                    <input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={fieldLine}
                    />
                  </td>
                </tr>
                <tr>
                  <td className={`${sheet.td} text-center font-medium`} scope="row">
                    보호자
                  </td>
                  <td className={sheet.td} colSpan={2}>
                    <input
                      value={phoneGuardian}
                      onChange={(e) => setPhoneGuardian(e.target.value)}
                      placeholder="000-0000-0000(모)"
                      className={`${fieldLine} inline-block w-[min(100%,11.5rem)] sm:w-56`}
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            {/* 학생 기본사항: 세로 제목 + 구분 + 항목 (3열) */}
            <table className={sheet.table}>
              <colgroup>
                <col className="w-[5.1rem] sm:w-[6rem]" />
                <col className="w-[5.1rem] sm:w-[6rem]" />
                <col />
              </colgroup>
              <tbody>
                <tr>
                  <th className={sheet.thSection} rowSpan={4} scope="rowgroup">
                    학생 기본사항
                  </th>
                  <th className={sheet.thCatHead} scope="col">
                    구분
                  </th>
                  <th className={sheet.thItemHead} scope="col">
                    항목(해당 시 체크, 중복 체크 가능)
                  </th>
                </tr>
                <tr>
                  <th className={sheet.thCat} scope="row">
                    기초수급 보장현황
                  </th>
                  <td className={sheet.td}>
                    <CheckboxGrid
                      compact
                      columns={2}
                      options={basicSupportOptions}
                      state={basicSupport}
                      onToggle={toggle(setBasicSupport)}
                    />
                  </td>
                </tr>
                <tr>
                  <th className={sheet.thCat} scope="row">
                    가족현황
                  </th>
                  <td className={sheet.td}>
                    <CheckboxGrid
                      compact
                      columns={2}
                      options={familyOptions}
                      state={family}
                      onToggle={toggle(setFamily)}
                      otherKey="fam_other"
                      otherValue={familyOtherDetail}
                      onOtherChange={setFamilyOtherDetail}
                    />
                  </td>
                </tr>
                <tr>
                  <th className={sheet.thCat} scope="row">
                    학생현황
                  </th>
                  <td className={sheet.td}>
                    <CheckboxGrid
                      compact
                      columns={2}
                      options={studentStatusOptions}
                      state={studentStatus}
                      onToggle={toggle(setStudentStatus)}
                      otherKey="stu_other"
                      otherValue={studentStatusOther}
                      onOtherChange={setStudentStatusOther}
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            {/* 학생 어려움 */}
            <table className={sheet.table}>
              <colgroup>
                <col className="w-[5.1rem] sm:w-[6rem]" />
                <col className="w-[5.1rem] sm:w-[6rem]" />
                <col />
              </colgroup>
              <tbody>
                <tr>
                  <th className={sheet.thSection} rowSpan={6} scope="rowgroup">
                    학생 어려움
                  </th>
                  <th className={sheet.thCatHead} scope="col">
                    구분
                  </th>
                  <th className={sheet.thItemHead} scope="col">
                    항목(해당 시 체크, 중복 체크 가능)
                  </th>
                </tr>
                <tr>
                  <th className={sheet.thCat} scope="row">
                    학업
                  </th>
                  <td className={sheet.td}>
                    <CheckboxGrid
                      compact
                      columns={3}
                      options={difficultyAcademic}
                      state={diffAcademic}
                      onToggle={toggle(setDiffAcademic)}
                      otherKey="acd_other"
                      otherValue={diffAcademicOther}
                      onOtherChange={setDiffAcademicOther}
                    />
                  </td>
                </tr>
                <tr>
                  <th className={sheet.thCat} scope="row">
                    심리･정서
                  </th>
                  <td className={sheet.td}>
                    <CheckboxGrid
                      compact
                      columns={3}
                      options={difficultyMental}
                      state={diffMental}
                      onToggle={toggle(setDiffMental)}
                      otherKey="men_other"
                      otherValue={diffMentalOther}
                      onOtherChange={setDiffMentalOther}
                    />
                  </td>
                </tr>
                <tr>
                  <th className={sheet.thCat} scope="row">
                    돌봄･안전･건강
                  </th>
                  <td className={sheet.td}>
                    <CheckboxGrid
                      compact
                      columns={3}
                      options={difficultyCare}
                      state={diffCare}
                      onToggle={toggle(setDiffCare)}
                      otherKey="car_other"
                      otherValue={diffCareOther}
                      onOtherChange={setDiffCareOther}
                    />
                  </td>
                </tr>
                <tr>
                  <th className={sheet.thCat} scope="row">
                    경제･생활
                  </th>
                  <td className={sheet.td}>
                    <CheckboxGrid
                      compact
                      columns={2}
                      options={difficultyEcon}
                      state={diffEcon}
                      onToggle={toggle(setDiffEcon)}
                      otherKey="eco_other"
                      otherValue={diffEconOther}
                      onOtherChange={setDiffEconOther}
                    />
                  </td>
                </tr>
                <tr>
                  <th className={sheet.thCat} scope="row">
                    기타
                  </th>
                  <td className={sheet.td}>
                    <textarea
                      value={diffOther}
                      onChange={(e) => setDiffOther(e.target.value)}
                      rows={3}
                      className={areaField}
                      placeholder="해당 시 기술"
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            {/* 신청 사유 · 지원 요청 (PDF 하단 2열) */}
            <table className={sheet.table}>
              <colgroup>
                <col className="w-[7.15rem] sm:w-[8.35rem]" />
                <col />
              </colgroup>
              <tbody>
                <tr>
                  <th className={`${sheet.thReason} align-top`} scope="row">
                    신청 사유
                    <p className="mt-1 font-normal text-[10px] leading-snug text-slate-700 sm:text-xs">
                      ※ 학생의 어려움 체크 항목을 중심으로 설명
                    </p>
                  </th>
                  <td className={sheet.td}>
                    <textarea
                      value={applyReason}
                      onChange={(e) => setApplyReason(e.target.value)}
                      rows={5}
                      className={`${areaField} min-h-[6rem]`}
                    />
                  </td>
                </tr>
                <tr>
                  <th className={sheet.thReason} scope="row">
                    지원 요청 사항
                  </th>
                  <td className={sheet.td}>
                    <textarea
                      value={supportRequest}
                      onChange={(e) => setSupportRequest(e.target.value)}
                      rows={5}
                      className={`${areaField} min-h-[6rem]`}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="space-y-6 border-t border-slate-900 bg-white px-3 py-8 sm:space-y-7 sm:px-6 sm:py-10">
            <p className="text-center text-sm font-medium leading-relaxed sm:text-base">
              위 학생을 학생맞춤통합지원 대상 학생으로 신청합니다.
            </p>
            <div
              className="flex flex-wrap items-end justify-center gap-x-2 gap-y-1 text-sm sm:gap-x-3 sm:text-base"
              aria-label="신청 일자"
            >
              <span className="pb-0.5 tabular-nums tracking-wider text-slate-900">20</span>
              <input
                value={applyYear}
                onChange={(e) => setApplyYear(e.target.value)}
                className={`${fieldLine} w-9 sm:w-10`}
                aria-label="연(끝 두 자리 등)"
                maxLength={4}
              />
              <span className="pb-0.5 text-slate-900">.</span>
              <input
                value={applyMonth}
                onChange={(e) => setApplyMonth(e.target.value)}
                className={`${fieldLine} w-8 sm:w-9`}
                aria-label="월"
                maxLength={2}
              />
              <span className="pb-0.5 text-slate-900">.</span>
              <input
                value={applyDay}
                onChange={(e) => setApplyDay(e.target.value)}
                className={`${fieldLine} w-8 sm:w-9`}
                aria-label="일"
                maxLength={2}
              />
              <span className="pb-0.5 text-slate-900">.</span>
            </div>
            <div className="flex justify-center px-2">
              <div className="flex w-auto max-w-full items-end justify-center gap-1 sm:gap-1.5">
                <span className="shrink-0 pb-0.5 text-sm font-medium text-slate-900 sm:text-base">
                  신청자:
                </span>
                <input
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  className={`${fieldLine} min-h-[1.75rem] w-[9rem] sm:w-[11rem]`}
                  aria-label="성명(필기)"
                />
                <span className="shrink-0 pb-0.5 text-sm text-slate-900 sm:text-base">(서명)</span>
              </div>
            </div>
            <p className="text-center text-[10px] leading-relaxed text-slate-700 sm:text-xs">
              ※ 학기초 개인정보의 수집･이용･제공 고지, 일괄 동의 안내 시 학생맞춤통합지원도 포함하여 진행
            </p>
          </div>
        </article>

        <div className="flex flex-wrap items-center gap-2 print:hidden">
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
                  {studentName || "—"} ·{" "}
                  {(() => {
                    const g = gradeYear.trim();
                    const c = classRoom.trim();
                    if (!g && !c) return "—";
                    return [g ? `${g}학년` : null, c ? `${c}반` : null].filter(Boolean).join(" ");
                  })()}{" "}
                  · {birthDate || "—"} · {gender === "male" ? "남" : gender === "female" ? "여" : "—"}
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
