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

/** `ai_추천기관_제도` 항목 — 복지 통합 데이터(`welfare_integrated_data.csv`) 스키마와 동일 키 */
export type StudentAnalyzeRecommendation = {
  category: string;
  suitability: number | null;
  welfareType: string;
  servId: string;
  servNm: string;
  agency: string;
  department: string;
  intrsThemaArray: string[];
  lifeArray: string[];
  srvPvsnNm: string;
  sprtCycNm: string;
  servDgst: string;
  servDtlLink: string;
  inqNum: number | null;
  contact: string | null;
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
    | undefined;

  const 학생맞춤통합지원_신청서 = base?.전체데이터?.학생맞춤통합지원_신청서;
  if (!학생맞춤통합지원_신청서) {
    throw new Error(`학생맞춤통합지원_신청서가 없는 학생 ID: ${studentId}`);
  }

  const payload신청서 = {
    대상학생_정보: {
      성명: 학생맞춤통합지원_신청서.대상학생_정보?.성명 ?? "",
      생년월일: 학생맞춤통합지원_신청서.대상학생_정보?.생년월일 ?? "",
      성별: 학생맞춤통합지원_신청서.대상학생_정보?.성별 ?? "",
      거주지역: 학생맞춤통합지원_신청서.대상학생_정보?.거주지역 ?? "",
      학교급: 학생맞춤통합지원_신청서.대상학생_정보?.학교급 ?? "",
      학년: 학생맞춤통합지원_신청서.대상학생_정보?.학년 ?? "",
    },
    학생_기본사항: {
      기초수급_보장현황: 학생맞춤통합지원_신청서.학생_기본사항?.기초수급_보장현황 ?? [],
      가족현황: 학생맞춤통합지원_신청서.학생_기본사항?.가족현황 ?? [],
      학생현황: 학생맞춤통합지원_신청서.학생_기본사항?.학생현황 ?? [],
    },
    학생_어려움: {
      학업: 학생맞춤통합지원_신청서.학생_어려움?.학업 ?? [],
      심리_정서: 학생맞춤통합지원_신청서.학생_어려움?.심리_정서 ?? [],
      돌봄_안전_건강: 학생맞춤통합지원_신청서.학생_어려움?.돌봄_안전_건강 ?? [],
      경제_생활: 학생맞춤통합지원_신청서.학생_어려움?.경제_생활 ?? [],
      기타: 학생맞춤통합지원_신청서.학생_어려움?.기타 ?? "",
    },
    신청_사유: 학생맞춤통합지원_신청서.신청_사유 ?? [],
    지원_요청_사항: 학생맞춤통합지원_신청서.지원_요청_사항 ?? [],
  };

  const 관찰일지목록 = getObservationsForStudent(studentId).map(mapObservationToJournalRow);

  return {
    전체데이터: {
      학생맞춤통합지원_신청서: payload신청서,
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

function asOptionalFiniteNumber(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim()) {
    const n = Number(v.trim());
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function asWelfareStringField(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function asWelfareStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  const out: string[] = [];
  for (const item of v) {
    if (typeof item === "string" && item.trim()) out.push(item.trim());
  }
  return out;
}

function asNullableContact(v: unknown): string | null {
  if (v == null) return null;
  if (typeof v !== "string") return null;
  const s = v.trim();
  return s.length ? s : null;
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

  const category = asWelfareStringField(r.category);
  const servNm = asWelfareStringField(r.servNm);
  if (!category || !servNm) return null;

  return {
    category,
    suitability: asOptionalFiniteNumber(r.suitability),
    welfareType: asWelfareStringField(r.welfareType),
    servId: asWelfareStringField(r.servId),
    servNm,
    agency: asWelfareStringField(r.agency),
    department: asWelfareStringField(r.department),
    intrsThemaArray: asWelfareStringArray(r.intrsThemaArray),
    lifeArray: asWelfareStringArray(r.lifeArray),
    srvPvsnNm: asWelfareStringField(r.srvPvsnNm),
    sprtCycNm: asWelfareStringField(r.sprtCycNm),
    servDgst: asWelfareStringField(r.servDgst),
    servDtlLink: asWelfareStringField(r.servDtlLink),
    inqNum: asOptionalFiniteNumber(r.inqNum),
    contact: asNullableContact(r.contact),
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
