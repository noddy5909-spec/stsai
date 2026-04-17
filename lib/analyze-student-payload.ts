import {
  getObservationsForStudent,
  studentApplicationDetailsById,
  type ObservationEntry,
} from "@/lib/mock-data";

/** `POST /api/analyze-student` 응답(본문 최상위 또는 `data` / `result` 래핑) */
export type StudentAnalyzeSummary = {
  이름: string;
  요약분석: string;
  핵심신호: string[];
};

export type StudentAnalyzeRecommendation = {
  구분: "제도" | "기관";
  기관명: string;
  적합도: string;
  기관설명: string;
  대상: string;
  지원내용: string[];
  신청절차: string[];
  필요서류: string[];
  문의: string;
};

export type StudentAnalyzeResult = {
  ai_분석정리_요약: StudentAnalyzeSummary;
  ai_추천기관_제도: StudentAnalyzeRecommendation[];
};

/**
 * 통합 신청 분석 요청 URL (동일 출처 프록시).
 * 실제 외부 API 주소는 서버 `app/api/analyze-student/route.ts`의 `ANALYZE_STUDENT_UPSTREAM_URL`에서 설정합니다.
 */
export const ANALYZE_STUDENT_API_URL = "/api/analyze-student";

export type AnalyzeStudentJournalRow = {
  교사이름: string;
  직위: string;
  날짜: string;
  시간: string;
  장소: string;
  내용: string;
  특이사항: string;
};

function normalizeTimePart(raw: string | undefined): string {
  if (!raw) return "00:00:00";
  const t = raw.trim();
  const parts = t.split(":");
  if (parts.length === 2) return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}:00`;
  if (parts.length >= 3)
    return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}:${parts[2].padStart(2, "0").slice(0, 2)}`;
  return "00:00:00";
}

/** 관리 학생 관찰 일지(목업)를 분석 API 스키마 행으로 변환 — `getObservationsForStudent`와 동일 소스 */
export function mapObservationToJournalRow(o: ObservationEntry): AnalyzeStudentJournalRow {
  const created = o.createdAt.trim();
  const [datePart, timePartRaw] = /\s/.test(created)
    ? (created.split(/\s+/, 2) as [string, string])
    : [created, ""];

  const placeMatch = o.content.match(/상담 장소:\s*([^\n\r]+)/);
  const 장소 = placeMatch?.[1]?.trim() || "교실";

  const bodyMatch = o.content.match(/내용:\s*([\s\S]*?)(?=\n\s*특이사항:|$)/);
  const 내용 = (bodyMatch?.[1] ?? o.content).trim();

  const noteMatch = o.content.match(/특이사항:\s*([\s\S]*?)\s*$/);
  const 특이사항 = (noteMatch?.[1] ?? "").trim();

  return {
    교사이름: o.author,
    직위: o.role,
    날짜: datePart,
    시간: normalizeTimePart(timePartRaw),
    장소,
    내용,
    특이사항,
  };
}

/**
 * 통합 신청 시 API로 보낼 요청 본문.
 * `managedStudents`의 `id`와 동일 키로 `studentApplicationDetailsById`·관찰 일지를 조회합니다.
 */
export function buildAnalyzeStudentPayload(studentId: string): Record<string, unknown> {
  const base = studentApplicationDetailsById[studentId] as
    | { 전체데이터?: { 통합신청서정보?: Record<string, unknown> } }
    | undefined;

  const 통합신청서정보 = base?.전체데이터?.통합신청서정보;
  if (!통합신청서정보) {
    throw new Error(`통합신청서정보가 없는 학생 ID: ${studentId}`);
  }

  const 관찰일지목록 = getObservationsForStudent(studentId).map(mapObservationToJournalRow);

  return {
    전체데이터: {
      통합신청서정보,
      관찰일지목록,
    },
  };
}

function asTrimmedString(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  return s.length ? s : null;
}

function asStringList(v: unknown): string[] | null {
  if (!Array.isArray(v)) return null;
  const out: string[] = [];
  for (const item of v) {
    if (typeof item !== "string" || !item.trim()) return null;
    out.push(item.trim());
  }
  return out;
}

function parseSummary(raw: unknown): StudentAnalyzeSummary | null {
  if (!raw || typeof raw !== "object") return null;
  const s = raw as Record<string, unknown>;
  const 이름 = asTrimmedString(s.이름);
  const 요약분석 = asTrimmedString(s.요약분석);
  const signals = asStringList(s.핵심신호);
  if (!이름 || !요약분석 || !signals) return null;
  return { 이름, 요약분석, 핵심신호: signals };
}

function parseRecommendation(raw: unknown): StudentAnalyzeRecommendation | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const 구분 = r.구분;
  if (구분 !== "제도" && 구분 !== "기관") return null;
  const 기관명 = asTrimmedString(r.기관명);
  const 적합도 = asTrimmedString(r.적합도);
  const 기관설명 = asTrimmedString(r.기관설명);
  const 대상 = asTrimmedString(r.대상);
  const 문의 = asTrimmedString(r.문의);
  const 지원내용 = asStringList(r.지원내용);
  const 신청절차 = asStringList(r.신청절차);
  const 필요서류 = asStringList(r.필요서류);
  if (!기관명 || !적합도 || !기관설명 || !대상 || !문의 || !지원내용 || !신청절차 || !필요서류) {
    return null;
  }
  return {
    구분,
    기관명,
    적합도,
    기관설명,
    대상,
    지원내용,
    신청절차,
    필요서류,
    문의,
  };
}

function parseResultBody(obj: Record<string, unknown>): StudentAnalyzeResult | null {
  const summary = parseSummary(obj.ai_분석정리_요약);
  const rawList = obj.ai_추천기관_제도;
  if (!summary || !Array.isArray(rawList)) return null;
  const ai_추천기관_제도: StudentAnalyzeRecommendation[] = [];
  for (const item of rawList) {
    const rec = parseRecommendation(item);
    if (!rec) return null;
    ai_추천기관_제도.push(rec);
  }
  return { ai_분석정리_요약: summary, ai_추천기관_제도 };
}

/** API JSON을 화면 표시용 구조로 파싱(형식 불일치 시 `null`) */
export function parseAnalyzeStudentResponse(raw: unknown): StudentAnalyzeResult | null {
  if (!raw || typeof raw !== "object") return null;
  const root = raw as Record<string, unknown>;
  const candidates: unknown[] = [root, root.data, root.result];
  for (const c of candidates) {
    if (c && typeof c === "object") {
      const parsed = parseResultBody(c as Record<string, unknown>);
      if (parsed) return parsed;
    }
  }
  return null;
}
