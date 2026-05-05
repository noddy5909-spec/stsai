/** 학맞통 EASY 프로토타입용 가상 데이터 */

export const focusStudent = {
  name: "김○○",
  gradeClass: "고등학교 1학년 3반",
  studentIdMasked: "20**-**34",
};

export type ManagedStudentStatus = "지원중" | "관찰" | "종결예정";

export type ManagedStudent = {
  id: string;
  name: string;
  gradeClass: string;
  status: ManagedStudentStatus;
  lastUpdated: string;
};

/**
 * 담당(관리) 학생 명단 — 목업.
 * 대시보드 `ManagedStudentsWithTabs`·통합지원신청 `ExchangeClient`가 동일 배열을 쓰며,
 * 통합 신청 요청 본문은 `studentApplicationDetailsById`·`getObservationsForStudent(id)`와 항상 같은 `id`로 맞춥니다.
 */
export const managedStudents: ManagedStudent[] = [
  {
    id: "ms-hgd-001",
    name: "홍길동",
    gradeClass: "초등학교 3학년 1반",
    status: "지원중",
    lastUpdated: "2026-04-14",
  },
  {
    id: "ms-lje-002",
    name: "이지은",
    gradeClass: "초등학교 3학년 1반",
    status: "지원중",
    lastUpdated: "2026-04-16",
  },
  {
    id: "ms-kjh-003",
    name: "김지훈",
    gradeClass: "고등학교 1학년 3반",
    status: "지원중",
    lastUpdated: "2026-05-05",
  },
];

/** 관리 학생 명단과 동일한 한 줄 요약(통합지원신청 선택 UI 등 공용) */
export function managedStudentSummaryLine(s: ManagedStudent): string {
  return `${s.gradeClass} · ${s.status} · 최근 갱신 ${s.lastUpdated}`;
}

/** `3학년 1반` 등 `…학년 …반` 형태를 표시용 학년·반 문자열로 분리 */
export function splitGradeClassDisplay(gradeClass: string): {
  gradeLabel: string;
  classLabel: string;
} {
  const s = gradeClass.trim();
  const m = s.match(/^(.+)\s+(\d+)\s*반\s*$/);
  if (m) return { gradeLabel: m[1].trim(), classLabel: `${m[2]}반` };
  return { gradeLabel: s || "—", classLabel: "—" };
}

export const studentApplicationDetailsById: Record<string, unknown> = {
  "ms-hgd-001": {
    전체데이터: {
      학생맞춤통합지원_신청서: {
        대상학생_정보: {
          성명: "홍길동",
          생년월일: "2015-05-20",
          성별: "남",
          거주지역: "서울특별시",
          학교급: "초등학교",
          학년: "3학년",
        },
        학생_기본사항: {
          기초수급_보장현황: ["법정차상위"],
          가족현황: ["부", "모", "여동생"],
          학생현황: ["교우관계 원만하나 수업 집중력 부족"],
        },
        학생_어려움: {
          학업: ["기초 학력 미달", "수업 참여 저조"],
          심리_정서: ["불안", "감정 조절 어려움"],
          돌봄_안전_건강: ["방과 후 보호자 부재로 인한 돌봄 공백"],
          경제_생활: ["체험학습비 등 교육비 납부 지연"],
          기타: "특이사항 없음",
        },
        신청_사유: [
          "교내 다수 교사의 관찰 결과 정서적 불안 및 돌발 행동이 반복적으로 확인됨",
          "학습 집중 저하와 생활 리듬 불균형으로 통합 지원 필요성이 높음",
        ],
        지원_요청_사항: [
          "전문 상담 교사 연계 및 정서 안정 프로그램 제공",
          "방과 후 학습 지원 및 돌봄 자원 연계",
        ],
      },
    },
  },
  "ms-lje-002": {
    전체데이터: {
      학생맞춤통합지원_신청서: {
        대상학생_정보: {
          성명: "이지은",
          생년월일: "2017-05-12",
          성별: "여",
          거주지역: "경기도 수원시",
          학교급: "초등학교",
          학년: "3학년",
        },
        학생_기본사항: {
          기초수급_보장현황: ["해당없음"],
          가족현황: ["부", "모", "남동생(유치원생)"],
          학생현황: ["밝고 활동적이나 규칙 준수가 어렵고 산만함"],
        },
        학생_어려움: {
          학업: ["읽기 및 쓰기 속도 저하", "과제 수행 미완료"],
          심리_정서: ["감정 기복", "과민 반응"],
          돌봄_안전_건강: ["계절에 맞지 않는 의복 착용", "위생 상태 불량"],
          경제_생활: ["준비물 구입 및 방과 후 간식 지원 부족"],
          기타: "스마트폰 과의존 증세 보임",
        },
        신청_사유: [
          "기초 학력 부진과 위생·영양 상태 우려가 동시에 관찰됨",
          "수업 중 충동적 행동으로 학급 운영에 어려움이 있어 통합 개입이 필요함",
        ],
        지원_요청_사항: [
          "기초학력 강화 프로그램 연계",
          "지역아동센터 연계 및 보호자 상담",
        ],
      },
    },
  },
  "ms-kjh-003": {
    전체데이터: {
      학생맞춤통합지원_신청서: {
        대상학생_정보: {
          성명: "김지훈",
          생년월일: "2010-05-15",
          성별: "남",
          거주지역: "제주특별자치도 제주시",
          학교급: "고등학교",
          학년: "1학년",
        },
        학생_기본사항: {
          기초수급_보장현황: ["법정차상위"],
          가족현황: ["부모 한부모(부)", "가족돌봄 아동청소년"],
          학생현황: [],
        },
        학생_어려움: {
          학업: ["교과 부족", "학업 중단 위기"],
          심리_정서: ["우울 불안", "무기력"],
          돌봄_안전_건강: ["부의 실직으로 인한 돌봄 공백"],
          경제_생활: ["경제적 어려움"],
          기타: "고등학교 입학 후 급격한 성적 하락으로 인한 극심한 자존감 저하 및 학업 중단 고민 호소",
        },
        신청_사유: [
          "진학 후 학업 난이도 상승에 따른 심리적 부담감 및 학습 무기력 심화",
          "갑작스러운 가정 내 경제적 위기 상황으로 인한 정서적 불안정 및 우울 증세 관찰",
          "방과 후 적절한 학습 환경 및 보호자 돌봄 부재로 인한 생활 패턴 불균형",
        ],
        지원_요청_사항: [
          "전문 상담 교사를 통한 학업 중단 예방 상담 및 심리 정서 안정 프로그램 지원",
          "교과 보충 및 기초 학력 강화를 위한 대학생 멘토링 프로그램 연계",
          "지역사회 복지 기관과 연계하여 장학금 및 생활비 지원 등 경제적 복지 서비스 제공",
        ],
      },
    },
  },
};

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
    match: (s) => s.status === "관찰" || s.id === "ms-hgd-001",
    baseConfidence: 88,
  },
  {
    id: "rec-youth-center",
    category: "기관",
    title: "청소년상담복지센터(1388) 및 지역 청소년쉼터",
    rationale:
      "가정·정서 스트레스 요인이 병행 관찰될 때 대면·전화 상담과 보호 연계를 병행할 수 있습니다.",
    match: (s) => s.id === "ms-hgd-001",
    baseConfidence: 85,
  },
  {
    id: "rec-student-welfare",
    category: "제도",
    title: "학생복지과 학생보호·지원 위기학생 개입 절차",
    rationale:
      "출석·생활 지도와 연계된 맞춤 지원이 필요한 사례로 교내 학생지원심의위원회 검토가 권장됩니다.",
    match: (s) => s.status === "지원중",
    baseConfidence: 83,
  },
  {
    id: "rec-learning-support",
    category: "제도",
    title: "학습 부진(학업성적저조) 예방·조기발견 지원(교과·보충 지도)",
    rationale:
      "학습·진로 지원이 필요한 사례로 학습 지원 및 진로 멘토링 체계와의 연계 점수가 높습니다.",
    match: (s) => s.id === "ms-lje-002",
    baseConfidence: 86,
  },
  {
    id: "rec-health",
    category: "기관",
    title: "교내 보건실·정신건강의학과(의뢰) 및 보건소 연계",
    rationale:
      "급식·수면·신체 증상 등 보건 키워드가 있어 보건·의료 경로를 병행하는 편이 알고리즘상 유리합니다.",
    match: (s) => s.id === "ms-lje-002",
    baseConfidence: 87,
  },
  {
    id: "rec-family-welfare",
    category: "기관",
    title: "지역아동센터·가족센터·복지관(시군구 복지) 연계",
    rationale:
      "가족·복지 키워드가 포함되어 있어 지역 복지 자원과의 공식 연계 서식을 우선 제안합니다.",
    match: (s) => s.id === "ms-lje-002",
    baseConfidence: 89,
  },
  {
    id: "rec-schl-violence",
    category: "제도",
    title: "학교폭력 대책심의위원회 및 피해자 보호 조치(해당 시)",
    rationale:
      "대인 관계·갈등 관련 기록이 있을 때 절차 준수 및 2차 피해 예방 관점에서 검토 항목에 포함됩니다.",
    match: (s) => s.id === "ms-hgd-001",
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
 * 학생 특성(상태·식별자 기반 목업)으로 규칙 기반 점수를 매기고,
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
  if (s.id === "ms-kjh-003") {
    observationsByStudentId[s.id] = [
      {
        id: `${s.id}-o1`,
        role: "담임",
        author: "이수영",
        visibility: "public",
        createdAt: "2026-04-13 08:30",
        content: `상담 장소: 1학년 3반 교실

내용: 아침 자습 시간에 지속적으로 엎드려 잠을 자거나 멍하게 있는 등 수업 준비에 전혀 참여하지 않는 무기력한 태도를 보임.

특이사항: 모의고사 성적 확인 후 '학교를 계속 다니는 것이 의미가 없다'며 자퇴 의사를 여러 번 내비쳐 밀착 상담이 필요함.`,
      },
      {
        id: `${s.id}-o2`,
        role: "교과전담",
        author: "박현우",
        visibility: "public",
        createdAt: "2026-04-15 10:20",
        content: `상담 장소: 수학실

내용: 문제 풀이 과정 중 심화 단계에서 난관에 봉착하자 샤프를 책상에 던지는 등 예민하고 충동적인 반응을 보이며 활동을 중단함.

특이사항: 중학교 과정의 기초가 부족하여 고교 수업 내용을 따라가는 데 심한 스트레스와 거부감을 느끼고 있음.`,
      },
      {
        id: `${s.id}-o3`,
        role: "상담",
        author: "정윤서",
        visibility: "public",
        createdAt: "2026-04-17 15:30",
        content: `상담 장소: 위클래스(Wee Class)

내용: 부의 실직 이후 경제적 불안감에 대해 이야기하며 눈물을 보임. 본인의 미래에 대해 매우 비관적이고 부정적인 인식을 가지고 있음.

특이사항: 우울감이 깊고 자아존중감이 낮아져 있어 정기적인 심리 상담과 더불어 즉각적인 생활 안정 지원 연계가 권장됨.`,
      },
    ];
    return;
  }

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
