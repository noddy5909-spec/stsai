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
    id: "ms-hgd-001",
    name: "홍길동",
    gradeClass: "3학년 1반",
    caseRef: "HMT-2026-0414",
    status: "지원중",
    supportArea: "학업·정서·돌봄·경제",
    lastUpdated: "2026-04-14",
  },
  {
    id: "ms-lje-002",
    name: "이지은",
    gradeClass: "3학년 1반",
    caseRef: "HMT-2026-0415",
    status: "지원중",
    supportArea: "학업·정서·돌봄·생활",
    lastUpdated: "2026-04-16",
  },
];

export const studentApplicationDetailsById: Record<string, unknown> = {
  "ms-hgd-001": {
    전체데이터: {
      통합신청서정보: {
        학생인적사항: {
          학생이름: "홍길동",
          학년: 3,
          반: 1,
          생년월일: "2015-05-20",
          성별: "남",
        },
        가정환경및자격: {
          학생기본사항: "부모님과 동거 중",
          기초수급보장현황: "차상위계층",
          가족현황: "부, 모, 여동생",
        },
        학생상태: {
          학생현황: "교우관계 원만하나 수업 집중력 부족",
          학생어려움: {
            학업: "기초 학력 미달 및 수업 참여 저조",
            심리_정서: "감정 조절에 어려움을 겪으며 불안 증세 보임",
            돌봄_안전_건강: "방과 후 보호자 부재로 인한 돌봄 공백",
            경제_생활: "체험학습비 등 교육비 납부 지연",
            기타: "특이사항 없음",
          },
        },
        신청사유:
          "교내 다수 교사의 관찰 결과 공통적으로 정서적 불안 및 돌발 행동이 포착되어 통합 지원 신청함",
        지원요청사항: "전문 상담 및 방과 후 학습 지원 연계",
      },
    },
  },
  "ms-lje-002": {
    전체데이터: {
      통합신청서정보: {
        학생인적사항: {
          학생이름: "이지은",
          학년: 3,
          반: 1,
          생년월일: "2017-05-12",
          성별: "여",
        },
        가정환경및자격: {
          학생기본사항: "부모님 맞벌이로 인한 평일 야간 방임 상태",
          기초수급보장현황: "해당없음 (일반 맞벌이 가정)",
          가족현황: "부, 모, 남동생(유치원생)",
        },
        학생상태: {
          학생현황: "매우 밝고 활동적이나 규칙 준수가 어렵고 산만함",
          학생어려움: {
            학업: "읽기 및 쓰기 속도가 현저히 느리며 과제 수행 미완료",
            심리_정서: "또래의 사소한 농담에 과하게 반응하며 감정 기복이 심함",
            돌봄_안전_건강: "계절에 맞지 않는 의복 착용 및 위생 상태(세탁, 세면) 불량",
            경제_생활: "준비물 구입 및 방과 후 간식 마련에 대한 부모님의 관심 부족",
            기타: "스마트폰 과의존 증세 보임",
          },
        },
        신청사유:
          "기초 학력 부진과 더불어 개인 위생 및 영양 상태가 우려되며, 수업 중 충동적인 행동으로 인해 학급 운영에 지장이 있어 통합적인 개입 요청",
        지원요청사항: "기초학력 지도, 지역아동센터 연계 및 부모 상담",
      },
    },
  },
};

/** 통합지원신청 — AI(목업) 추천 제도·기관 */
export type SupportRecommendation = {
  id: string;
  category: "제도" | "기관";
  title: string;
  rationale: string;
  confidencePercent: number;
};

export type AiSummaryMockData = {
  이름: string;
  요약분석: string;
  핵심신호: string[];
};

export type AiRecommendationMockItem = {
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

export type AiApplyMockData = {
  ai_분석정리_요약: AiSummaryMockData;
  ai_추천기관_제도: AiRecommendationMockItem[];
};

const DEFAULT_AI_APPLY_MOCK_DATA: AiApplyMockData = {
  ai_분석정리_요약: {
    이름: "홍길동",
    요약분석:
      "API 사용량 제한으로 AI 모델 호출이 지연되어, 입력 데이터 기반의 안전 분석 결과를 제공합니다. 홍길동 학생은 기초 학력 미달 및 수업 참여 저조 상태이며, 감정 조절에 어려움을 겪으며 불안 증세 보임. 또한 방과 후 보호자 부재로 인한 돌봄 공백 상황으로 확인되어 학습·정서·돌봄 영역의 통합 지원 연계가 필요합니다.",
    핵심신호: ["기초 학력 미달", "정서 불안", "돌봄 공백", "등교", "직후부터"],
  },
  ai_추천기관_제도: [
    {
      구분: "제도",
      기관명: "기초학력 디딤학습 바우처",
      적합도: "63%",
      기관설명: "지역 기관 안내 데이터 기반으로 학생 특성과 연관성이 높은 제도 연계 정보",
      대상: "기초 학력 미달 또는 학습 결손이 확인된 초등학생",
      지원내용: ["방과", "학습코칭 비용 월 20만원 한도 지원"],
      신청절차: ["온라인 신청", "학교 확인 절차"],
      필요서류: ["학생생활기록 요약", "진단평가 결과지", "신분증 사본"],
      문의: "교육청 콜센터 1588-3000",
    },
    {
      구분: "기관",
      기관명: "우리동네 긴급돌봄센터",
      적합도: "61%",
      기관설명: "지역 기관 안내 데이터 기반으로 학생 특성과 연관성이 높은 기관 연계 정보",
      대상: "방과 후 보호 공백이 발생하는 맞벌이 및 취약가정 학생",
      지원내용: ["평일 13시-20시 긴급 돌봄", "간식 지원"],
      신청절차: ["주민센터 또는 학교 복지담당 연계 신청"],
      필요서류: ["돌봄 공백 확인서", "가족관계증명서"],
      문의: "동주민센터 120",
    },
    {
      구분: "기관",
      기관명: "마음성장 아동청소년 상담센터",
      적합도: "60%",
      기관설명: "지역 기관 안내 데이터 기반으로 학생 특성과 연관성이 높은 기관 연계 정보",
      대상: "정서 불안 및 행동 조절 어려움이 있는 초중학생",
      지원내용: ["주 1회 전문 심리상담", "부모 코칭 8회기 제공"],
      신청절차: ["학교 추천서 접수", "초기면접 진행"],
      필요서류: ["통합신청서", "보호자 동의서", "학교의견서"],
      문의: "02-1111-2222",
    },
  ],
};

const LJE_AI_APPLY_MOCK_DATA: AiApplyMockData = {
  ai_분석정리_요약: {
    이름: "이지은",
    요약분석:
      "API 사용량 제한으로 AI 모델 호출이 지연되어, 입력 데이터 기반의 안전 분석 결과를 제공합니다. 이지은 학생은 읽기 및 쓰기 속도가 현저히 느리며 과제 수행 미완료 상태이며, 또래의 사소한 농담에 과하게 반응하며 감정 기복이 심함. 또한 계절에 맞지 않는 의복 착용 및 위생 상태(세탁, 세면) 불량 상황으로 확인되어 학습·정서·돌봄 영역의 통합 지원 연계가 필요합니다.",
    핵심신호: ["기초 학력 미달", "정서 불안", "돌봄 공백", "가정", "아침"],
  },
  ai_추천기관_제도: [
    {
      구분: "제도",
      기관명: "기초학력 디딤학습 바우처",
      적합도: "62%",
      기관설명: "지역 기관 안내 데이터 기반으로 학생 특성과 연관성이 높은 제도 연계 정보",
      대상: "기초 학력 미달 또는 학습 결손이 확인된 초등학생",
      지원내용: ["방과", "학습코칭 비용 월 20만원 한도 지원"],
      신청절차: ["온라인 신청", "학교 확인 절차"],
      필요서류: ["학생생활기록 요약", "진단평가 결과지", "신분증 사본"],
      문의: "교육청 콜센터 1588-3000",
    },
    {
      구분: "기관",
      기관명: "우리동네 긴급돌봄센터",
      적합도: "60%",
      기관설명: "지역 기관 안내 데이터 기반으로 학생 특성과 연관성이 높은 기관 연계 정보",
      대상: "방과 후 보호 공백이 발생하는 맞벌이 및 취약가정 학생",
      지원내용: ["평일 13시-20시 긴급 돌봄", "간식 지원"],
      신청절차: ["주민센터 또는 학교 복지담당 연계 신청"],
      필요서류: ["돌봄 공백 확인서", "가족관계증명서"],
      문의: "동주민센터 120",
    },
    {
      구분: "기관",
      기관명: "마음성장 아동청소년 상담센터",
      적합도: "59%",
      기관설명: "지역 기관 안내 데이터 기반으로 학생 특성과 연관성이 높은 기관 연계 정보",
      대상: "정서 불안 및 행동 조절 어려움이 있는 초중학생",
      지원내용: ["주 1회 전문 심리상담", "부모 코칭 8회기 제공"],
      신청절차: ["학교 추천서 접수", "초기면접 진행"],
      필요서류: ["통합신청서", "보호자 동의서", "학교의견서"],
      문의: "02-1111-2222",
    },
  ],
};

const aiApplyMockDataByStudentId: Record<string, AiApplyMockData> = {
  "ms-hgd-001": DEFAULT_AI_APPLY_MOCK_DATA,
  "ms-lje-002": LJE_AI_APPLY_MOCK_DATA,
};

export function getAiApplyMockData(studentId: string): AiApplyMockData {
  return aiApplyMockDataByStudentId[studentId] ?? DEFAULT_AI_APPLY_MOCK_DATA;
}

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
export type ObservationRole =
  | "담임"
  | "교과전담"
  | "상담"
  | "보건"
  | "교감실"
  | "총괄";

/** 상담·관찰 일지 태그 선택지(목업) */
export const observationTagOptions = [
  "출석",
  "정서",
  "과제",
  "관찰",
  "상담",
  "급식",
  "건강",
  "가족",
  "대인",
  "학업",
  "기타",
] as const;

export type ObservationEntry = {
  id: string;
  role: ObservationRole;
  author: string;
  visibility: "public" | "private";
  content: string;
  createdAt: string;
  tags?: string[];
};

/** 학생별 관찰 및 상담 일지(목업) — 명단 행 클릭 시 표시 */
export const observationsByStudentId: Record<string, ObservationEntry[]> = {};

managedStudents.forEach((s) => {
  if (s.id === "ms-lje-002") {
    observationsByStudentId[s.id] = [
      {
        id: `${s.id}-o1`,
        role: "담임",
        author: "최강혁",
        visibility: "public",
        createdAt: "2026-04-13 08:50",
        content: `상담 장소: 교실

내용: 등교 시 머리카락이 떡져 있고 옷에서 냄새가 남. 아침 식사를 하지 않았다고 하며 친구의 간식을 허락 없이 먹으려 함.

특이사항: 가정 내 아침 기상 및 등교 준비 지원이 전혀 이루어지지 않는 것으로 보임.`,
      },
      {
        id: `${s.id}-o2`,
        role: "보건",
        author: "한소희",
        visibility: "public",
        createdAt: "2026-04-14 10:30",
        content: `상담 장소: 보건실

내용: 체육 시간 중 찰과상으로 방문. 상처 치료 중 어젯밤 늦게까지 게임을 하느라 잠을 거의 자지 못했다고 토로함.

특이사항: 수면 부족으로 인한 만성 피로와 안색이 창백함이 관찰됨.`,
      },
      {
        id: `${s.id}-o3`,
        role: "교과전담",
        author: "김지수",
        visibility: "public",
        createdAt: "2026-04-16 11:20",
        content: `상담 장소: 음악실

내용: 리코더 연주 시간 중 악기를 두드리며 소음을 유발함. 주의를 주자 리코더를 바닥에 던지고 책상 아래로 들어가 나오지 않음.

특이사항: 본인의 욕구가 즉각 충족되지 않을 때 나타나는 회피성 돌발 행동이 강해짐.`,
      },
    ];
    return;
  }

  observationsByStudentId[s.id] = [
    {
      id: `${s.id}-o1`,
      role: "담임",
      author: "김철수",
      visibility: "public",
      createdAt: "2026-04-07 09:10",
      content: `상담 장소: 교실

내용: 1교시 수업 시작 전, 가방을 던지며 자리에 앉지 않고 교실 뒤편을 배회함. 진정시키려 했으나 거부함.

특이사항: 등교 직후부터 기분이 매우 저조해 보임.`,
    },
    {
      id: `${s.id}-o2`,
      role: "교과전담",
      author: "이영희",
      visibility: "public",
      createdAt: "2026-04-08 13:30",
      content: `상담 장소: 과학실

내용: 모둠 활동 중 친구의 도구를 무단으로 사용하여 말다툼 발생. 소리를 지르며 복도로 나감.

특이사항: 사회성 기술 부족으로 인한 갈등 빈도가 높아짐.`,
    },
    {
      id: `${s.id}-o3`,
      role: "상담",
      author: "박민수",
      visibility: "public",
      createdAt: "2026-04-09 15:00",
      content: `상담 장소: 위클래스

내용: 개별 상담 중 가정 내 부모님과의 불화를 언급하며 눈물을 보임. 집중력이 매우 짧고 손톱을 깨무는 행동 관찰됨.

특이사항: 정서적 지지 기반이 취약하여 긴급 돌봄 연계 검토 필요.`,
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
