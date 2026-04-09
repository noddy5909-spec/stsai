/** 학맞통 EASY 프로토타입용 가상 데이터 */

export const focusStudent = {
  name: "김○○",
  gradeClass: "고등학교 1학년 3반",
  studentIdMasked: "20**-**34",
  caseRef: "HMT-2026-0412",
};

export type ManagedStudentStatus = "지원중" | "관찰" | "종결예정";

export type ManagedStudent = {
  id: string;
  name: string;
  gradeClass: string;
  caseRef: string;
  status: ManagedStudentStatus;
  supportArea: string;
  lastUpdated: string;
};

/**
 * 담당(관리) 학생 명단 — 목업.
 * 대시보드 `ManagedStudentsWithTabs`와 통합지원신청 `ExchangeClient`가 동일 배열을 사용합니다.
 */
export const managedStudents: ManagedStudent[] = [
  {
    id: "ms1",
    name: "김○○",
    gradeClass: "고1 3반",
    caseRef: "HMT-2026-0412",
    status: "지원중",
    supportArea: "정서·학업",
    lastUpdated: "2026-04-03",
  },
  {
    id: "ms2",
    name: "이○○",
    gradeClass: "고2 1반",
    caseRef: "HMT-2026-0398",
    status: "지원중",
    supportArea: "학업·출석",
    lastUpdated: "2026-04-02",
  },
  {
    id: "ms3",
    name: "박○○",
    gradeClass: "고1 5반",
    caseRef: "HMT-2026-0385",
    status: "관찰",
    supportArea: "대인·정서",
    lastUpdated: "2026-04-02",
  },
  {
    id: "ms4",
    name: "최○○",
    gradeClass: "고3 2반",
    caseRef: "HMT-2026-0371",
    status: "지원중",
    supportArea: "진로·학업",
    lastUpdated: "2026-04-01",
  },
  {
    id: "ms5",
    name: "정○○",
    gradeClass: "고2 4반",
    caseRef: "HMT-2026-0360",
    status: "종결예정",
    supportArea: "가족·복지연계",
    lastUpdated: "2026-03-30",
  },
  {
    id: "ms6",
    name: "한○○",
    gradeClass: "고1 2반",
    caseRef: "HMT-2026-0354",
    status: "관찰",
    supportArea: "보건·급식",
    lastUpdated: "2026-04-03",
  },
  {
    id: "ms7",
    name: "조○○",
    gradeClass: "고3 6반",
    caseRef: "HMT-2026-0342",
    status: "지원중",
    supportArea: "정서·상담",
    lastUpdated: "2026-04-02",
  },
  {
    id: "ms8",
    name: "윤○○",
    gradeClass: "고2 3반",
    caseRef: "HMT-2026-0331",
    status: "지원중",
    supportArea: "학업",
    lastUpdated: "2026-03-29",
  },
  {
    id: "ms9",
    name: "강○○",
    gradeClass: "고1 1반",
    caseRef: "HMT-2026-0328",
    status: "관찰",
    supportArea: "출석·생활",
    lastUpdated: "2026-03-28",
  },
  {
    id: "ms10",
    name: "서○○",
    gradeClass: "고2 7반",
    caseRef: "HMT-2026-0315",
    status: "지원중",
    supportArea: "정서·가족",
    lastUpdated: "2026-04-01",
  },
  {
    id: "ms11",
    name: "임○○",
    gradeClass: "고3 4반",
    caseRef: "HMT-2026-0309",
    status: "지원중",
    supportArea: "학업·수행",
    lastUpdated: "2026-03-31",
  },
  {
    id: "ms12",
    name: "홍○○",
    gradeClass: "고1 6반",
    caseRef: "HMT-2026-0301",
    status: "종결예정",
    supportArea: "복지연계",
    lastUpdated: "2026-03-27",
  },
];

/** 통합지원신청 — AI(목업) 추천 제도·기관 */
export type SupportRecommendation = {
  id: string;
  category: "제도" | "기관";
  title: string;
  rationale: string;
  confidencePercent: number;
};

type RecDef = {
  id: string;
  category: "제도" | "기관";
  title: string;
  rationale: string;
  /** 학생 프로필과의 규칙 기반 매칭(실서비스에선 모델 출력으로 대체) */
  match: (s: ManagedStudent) => boolean;
  baseConfidence: number;
};

const REC_DEFINITIONS: RecDef[] = [
  {
    id: "rec-wee",
    category: "기관",
    title: "교육청 Wee 클래스(초·중·고) / Wee 센터 연계",
    rationale:
      "정서·행동 어려음이 의심되는 경우 학교·교육청 차원의 전문 상담·치료 연계가 우선 고려됩니다.",
    match: (s) =>
      /정서|상담|대인|가족/.test(s.supportArea) || s.status === "관찰",
    baseConfidence: 88,
  },
  {
    id: "rec-youth-center",
    category: "기관",
    title: "청소년상담복지센터(1388) 및 지역 청소년쉼터",
    rationale:
      "가정·정서 스트레스 요인이 병행 관찰될 때 대면·전화 상담과 보호 연계를 병행할 수 있습니다.",
    match: (s) => /정서|가족|대인/.test(s.supportArea),
    baseConfidence: 85,
  },
  {
    id: "rec-student-welfare",
    category: "제도",
    title: "학생복지과 학생보호·지원 위기학생 개입 절차",
    rationale:
      "출석·생활 지도와 연계된 맞춤 지원이 필요한 사례로 교내 학생지원심의위원회 검토가 권장됩니다.",
    match: (s) =>
      /출석|생활|학업/.test(s.supportArea) || s.status === "지원중",
    baseConfidence: 83,
  },
  {
    id: "rec-learning-support",
    category: "제도",
    title: "학습 부진(학업성적저조) 예방·조기발견 지원(교과·보충 지도)",
    rationale:
      "지원영역에 학업·수행·진로 요소가 포함되어 학습 지원 및 진로 멘토링 체계와의 연계 점수가 높습니다.",
    match: (s) => /학업|수행|진로/.test(s.supportArea),
    baseConfidence: 86,
  },
  {
    id: "rec-health",
    category: "기관",
    title: "교내 보건실·정신건강의학과(의뢰) 및 보건소 연계",
    rationale:
      "급식·수면·신체 증상 등 보건 키워드가 있어 보건·의료 경로를 병행하는 편이 알고리즘상 유리합니다.",
    match: (s) => /보건|급식/.test(s.supportArea),
    baseConfidence: 87,
  },
  {
    id: "rec-family-welfare",
    category: "기관",
    title: "지역아동센터·가족센터·복지관(시군구 복지) 연계",
    rationale:
      "가족·복지 키워드가 포함되어 있어 지역 복지 자원과의 공식 연계 서식을 우선 제안합니다.",
    match: (s) => /가족|복지/.test(s.supportArea),
    baseConfidence: 89,
  },
  {
    id: "rec-schl-violence",
    category: "제도",
    title: "학교폭력 대책심의위원회 및 피해자 보호 조치(해당 시)",
    rationale:
      "대인 관계·갈등 관련 기록이 있을 때 절차 준수 및 2차 피해 예방 관점에서 검토 항목에 포함됩니다.",
    match: (s) => /대인|정서/.test(s.supportArea),
    baseConfidence: 76,
  },
  {
    id: "rec-aftercare",
    category: "제도",
    title: "사후 관리·종결 이후 모니터링(학생맞춤형 통합지원 후속 절차)",
    rationale:
      "사례 상태가 종결 예정 단계로, 단계적 이관과 추적 관찰 일정 수립이 추천됩니다.",
    match: (s) => s.status === "종결예정",
    baseConfidence: 81,
  },
  {
    id: "rec-default-a",
    category: "제도",
    title: "교육부·교육청 학생맞춤형 통합지원 시범 연계 안내",
    rationale:
      "프로파일 일반 매칭 — 통합지원 TF 개최 및 참여 부서 공유를 기본으로 포함합니다.",
    match: () => true,
    baseConfidence: 72,
  },
  {
    id: "rec-default-b",
    category: "기관",
    title: "시·군·구 교육복지 우선지원단(또는 유사 지역 협의체)",
    rationale:
      "교내 조치와 병행하여 행정·복지 담당자 정보 공유가 필요한 경우 보조 추천됩니다.",
    match: () => true,
    baseConfidence: 70,
  },
];

function stableStudentHash(id: string): number {
  let x = 2166136261;
  for (let i = 0; i < id.length; i++) {
    x ^= id.charCodeAt(i);
    x = Math.imul(x, 16777619);
  }
  return Math.abs(x);
}

/**
 * 학생 특성(지원영역·상태)을 입력으로 규칙 기반 점수를 매기고,
 * 실제 서비스에서는 동일 슬롯에 LLM/랭킹 모델 결과를 넣는 형태로 치환 가능합니다.
 */
export function getSupportRecommendations(
  student: ManagedStudent,
): SupportRecommendation[] {
  const h = stableStudentHash(student.id);
  const matched = REC_DEFINITIONS.filter((r) => r.match(student));

  const byId = new Map<string, RecDef>();
  for (const r of matched) {
    if (!byId.has(r.id) || r.baseConfidence > (byId.get(r.id)?.baseConfidence ?? 0)) {
      byId.set(r.id, r);
    }
  }

  let list = [...byId.values()];
  list.sort((a, b) => b.baseConfidence - a.baseConfidence);

  // 학생별로 고유한 순위 흔들기(목업 ‘알고리즘’ 변동)
  list.sort((a, b) => {
    const tie = b.baseConfidence - a.baseConfidence;
    if (tie !== 0) return tie;
    return (stableStudentHash(a.id + student.id) % 10) -
      (stableStudentHash(b.id + student.id) % 10);
  });

  const maxItems = 5;
  list = list.slice(0, maxItems);

  return list.map((r, i) => ({
    id: r.id,
    category: r.category,
    title: r.title,
    rationale: r.rationale,
    confidencePercent: Math.min(
      97,
      r.baseConfidence + ((h + i * 17) % 6) - (i === 0 ? 0 : 1),
    ),
  }));
}

export const dashboardStats = {
  activeSupport: managedStudents.length,
  newObservations: 5,
  pendingTasks: 7,
  completedThisWeek: 18,
};

export const todayTasks = [
  { id: "t1", title: "3반 김○○ 학생 관찰 및 상담 일지 검토", due: "오늘 15:00", urgent: true },
  { id: "t2", title: "보건 교사 협의 회신(급식 거부 건)", due: "오늘 17:00", urgent: false },
  { id: "t3", title: "지역 복지관 연계 서류 최종 확인", due: "내일 10:00", urgent: false },
];

export const notifications = [
  {
    id: "c1",
    dept: "상담실",
    message: "개인 면담 일정이 조정되었습니다. 내일 4교시 → 5교시로 변경 요청 드립니다.",
    time: "32분 전",
    avatar: "상",
  },
  {
    id: "c2",
    dept: "보건실",
    message: "건강 관찰 기록(수면·식이) 양식 공유 완료. 담임 확인 부탁드립니다.",
    time: "1시간 전",
    avatar: "보",
  },
  {
    id: "c3",
    dept: "행정실",
    message: "지원 신청 마감 D-3 알림. 필요 서류 목록을 대시보드에 반영했습니다.",
    time: "3시간 전",
    avatar: "행",
  },
];

/** (구) 부서별 협업 알림: 호환용 alias */
export const collaborationFeed = notifications;
export type ObservationRole = "담임" | "상담" | "보건" | "교감실" | "총괄";

export type ObservationEntry = {
  id: string;
  role: ObservationRole;
  author: string;
  visibility: "public" | "private";
  content: string;
  createdAt: string;
  tags?: string[];
};

export const initialObservations: ObservationEntry[] = [
  {
    id: "o1",
    role: "담임",
    author: "이○○",
    visibility: "public",
    content:
      "최근 수업 참여도가 낮고 과제 제출이 두 차례 누락되었습니다. 친구 관계 질문 시 회피하는 모습이 관찰됩니다.",
    createdAt: "2026-04-02 14:20",
    tags: ["출석", "과제"],
  },
  {
    id: "o2",
    role: "상담",
    author: "박○○",
    visibility: "public",
    content:
      "개별 면담에서 가족 갈등 언급. 정서적으로 불안해 보이며 긍정적 자기 진술이 어려운 상태입니다.",
    createdAt: "2026-04-02 16:05",
    tags: ["정서", "가족"],
  },
  {
    id: "o3",
    role: "보건",
    author: "최○○",
    visibility: "public",
    content:
      "점심 급식 섭취량 감소(2주 지속). 두통 호소 1회. 수면 시간 부족 가능성 안내.",
    createdAt: "2026-04-03 09:10",
    tags: ["급식", "건강"],
  },
];

/** 학생별 관찰 및 상담 일지(목업) — 명단 행 클릭 시 표시 */
export const observationsByStudentId: Record<string, ObservationEntry[]> = {};

managedStudents.forEach((s) => {
  if (s.id === "ms1") {
    observationsByStudentId[s.id] = initialObservations.map((o) => ({
      ...o,
      id: `${s.id}-${o.id}`,
    }));
    return;
  }
  observationsByStudentId[s.id] = [
    {
      id: `${s.id}-o1`,
      role: "담임",
      author: "이○○",
      visibility: "public",
      content: `${s.name} 학생: 출석·수업 참여 관찰 메모(목업). ${s.gradeClass}`,
      createdAt: "2026-04-02 09:15",
      tags: ["관찰", "출석"],
    },
    {
      id: `${s.id}-o2`,
      role: "상담",
      author: "박○○",
      visibility: "public",
      content: `${s.name} 학생 정기 면담 기록(목업). 사례 ${s.caseRef}`,
      createdAt: "2026-03-28 16:00",
      tags: ["상담"],
    },
  ];
});

export function getObservationsForStudent(studentId: string): ObservationEntry[] {
  return observationsByStudentId[studentId] ?? [];
}

export const aiKeywords = [
  { label: "정서 불안", weight: 92 },
  { label: "기초학력 저하", weight: 71 },
  { label: "대인 회피", weight: 68 },
  { label: "가족 스트레스", weight: 64 },
  { label: "수면·영양", weight: 55 },
  { label: "학업 참여도", weight: 83 },
];

export const aiSummary =
  "관찰·상담·보건 기록을 종합하면, 학업 참여 저하와 정서적 불안이 동시에 나타나고 있습니다. 대인 상황에서의 회피와 가족 관련 스트레스 언급이 반복되어, 학습 지원과 정서 지원을 병행할 필요가 있습니다. 보건 측면에서는 식이·수면 패턴 점검이 권장됩니다.";

export const adminDocSummary = `[행정 서류용 자동 요약문 — 초안]
대상 학생은 최근 2주간 과제 미제출 및 수업 참여도 저하가 관찰되며, 개별 면담에서 정서적 불안과 가족 관련 스트레스가 확인되었습니다. 급식 섭취 감소 및 수면 부족 가능성이 보고되어, 교과·정서·보건 영역의 통합 지원이 필요한 것으로 판단됩니다. 본 요약은 사내 통합 관찰 기록을 기반으로 자동 생성된 초안이며, 담당 교사의 최종 확인 후 공문에 반영하시기 바랍니다.`;

export type WelfareInstitution = {
  id: string;
  name: string;
  type: string;
  distanceKm: number;
  address: string;
  phone: string;
  lat: number;
  lng: number;
};

/** 공공데이터 API(가상) 응답 형태 */
export const mockNearbyInstitutions: WelfareInstitution[] = [
  {
    id: "w1",
    name: "○○시 청소년 상담복지센터",
    type: "상담·심리",
    distanceKm: 1.2,
    address: "○○시 ○○구 학교로 120",
    phone: "031-***-5678",
    lat: 0.35,
    lng: 0.42,
  },
  {
    id: "w2",
    name: "○○군 아동청소년 통합지원센터",
    type: "복지 연계",
    distanceKm: 2.8,
    address: "○○시 ○○구 복지대로 88",
    phone: "031-***-9012",
    lat: 0.62,
    lng: 0.28,
  },
  {
    id: "w3",
    name: "지역 정신건강복지센터 ○○분소",
    type: "정신건강",
    distanceKm: 3.1,
    address: "○○시 ○○구 건강로 45",
    phone: "031-***-3456",
    lat: 0.55,
    lng: 0.65,
  },
];

export const yieldFeed = [
  {
    id: "y1",
    author: "담임 이○○",
    role: "담임" as ObservationRole,
    content: "주간 국어 수행평가 참여 완료. 수업 중 발표 1회 자발적으로 실시함.",
    date: "2026-04-01",
  },
  {
    id: "y2",
    author: "상담 박○○",
    role: "상담" as ObservationRole,
    content: "정기 면담(2회차). 가정 연락 후 정서 상태 안정 경향. 후속 일정 2주 후.",
    date: "2026-04-02",
  },
];

export const initialChatMessages = [
  { id: "m1", author: "이○○(담임)", text: "복지관 연계 일정 학부모 동의 받았습니다.", time: "10:12" },
  { id: "m2", author: "박○○(상담)", text: "확인 감사합니다. 방문 상담 때 제가 동행할게요.", time: "10:18" },
];
