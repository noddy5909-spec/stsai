import Link from "next/link";
import { LandingMediaTabs, LandingNoticeTabs } from "@/components/LandingTabs";
import { PrivacyFooter } from "@/components/PrivacyFooter";

const NAVY = "#003876";

const serviceTiles = [
  { label: "통합 관찰일지", tone: "bg-amber-100 text-amber-900" },
  { label: "통합지원신청", tone: "bg-emerald-100 text-emerald-900" },
  { label: "맞춤 진단·요약", tone: "bg-sky-100 text-sky-900" },
  { label: "기관·제도 연계", tone: "bg-rose-100 text-rose-900" },
  { label: "사후·기록 관리", tone: "bg-violet-100 text-violet-900" },
  { label: "협업 알림", tone: "bg-lime-100 text-lime-900" },
  { label: "Wee·상담 연계(목업)", tone: "bg-cyan-100 text-cyan-900" },
  { label: "학부모 안내(목업)", tone: "bg-orange-100 text-orange-900" },
  { label: "통계·대시보드(목업)", tone: "bg-indigo-100 text-indigo-900" },
  { label: "행정 서식(목업)", tone: "bg-teal-100 text-teal-900" },
  { label: "AI 추천·초안(목업)", tone: "bg-fuchsia-100 text-fuchsia-900" },
  { label: "교육 자료실(목업)", tone: "bg-stone-200 text-stone-800" },
] as const;

const pressItems = [
  {
    cat: "보도자료",
    title: "학맞통 EASY 시범 화면 공개(목업)",
    excerpt: "관찰부터 지원까지 한 화면에서 연결하는 프로토타입을 소개합니다.",
    date: "2026-04-02",
  },
  {
    cat: "공지",
    title: "통합 관찰일지 입력 항목 조정(목업)",
    excerpt: "현장 피드백을 반영한 안내 문구가 반영되었습니다.",
    date: "2026-03-28",
  },
  {
    cat: "설명",
    title: "데이터는 브라우저에만 머무릅니다(목업)",
    excerpt: "실제 전송·저장은 이루어지지 않습니다.",
    date: "2026-03-25",
  },
  {
    cat: "행사",
    title: "교사 대상 워크숍 사전 안내(목업)",
    excerpt: "4월 중 온라인 안내 예정입니다.",
    date: "2026-03-20",
  },
];

const briefingCards = [
  { title: "지역 교육청 연수 일정(목업)", sub: "통합지원 프로세스" },
  { title: "학생 보호 위원회 공유(목업)", sub: "사례·기록" },
  { title: "복지·보건 연계 동향(목업)", sub: "기관 협업" },
  { title: "디지털 행정 우수 사례(목업)", sub: "현장 적용" },
  { title: "맞춤형 지원 점검(목업)", sub: "운영 지표" },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-800">
      {/* Utility bar — 공공기관 스타일 상단 보조 */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs text-slate-600 sm:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-medium text-slate-800">홈</span>
            <span className="text-slate-300">|</span>
            <a href="#features" className="hover:text-[#003876]">
              소식
            </a>
            <a href="#services" className="hover:text-[#003876]">
              서비스
            </a>
            <a href="#security" className="hover:text-[#003876]">
              보안·안내
            </a>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="land-search" className="sr-only">
              검색
            </label>
            <input
              id="land-search"
              type="search"
              placeholder="검색어 입력(목업)"
              readOnly
              className="w-40 rounded border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs outline-none sm:w-52"
            />
          </div>
        </div>
      </div>

      {/* Main header — 네이비 */}
      <header
        className="sticky top-0 z-20 shadow-md"
        style={{ backgroundColor: NAVY }}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Link href="/landing" className="text-white">
            <p className="text-base font-bold tracking-tight sm:text-lg">
              학맞통 EASY
            </p>
            <p className="mt-0.5 text-xs text-white/85">
              학생맞춤통합지원 행정 프로토타입
            </p>
          </Link>
          <nav
            className="flex flex-wrap gap-x-1 gap-y-2 text-sm text-white/95"
            aria-label="주요 메뉴"
          >
            {[
              ["#alerts", "참여·민원(목업)"],
              ["#features", "알림·소식"],
              ["#services", "정책·서비스"],
              ["#security", "정보·법령(목업)"],
              ["#faq", "소개·FAQ"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="rounded px-2 py-1 hover:bg-white/15"
              >
                {label}
              </a>
            ))}
            <Link
              href="/dashboard"
              className="rounded border border-white/40 bg-white/10 px-3 py-1 font-medium text-white hover:bg-white/20"
            >
              포털
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero slogan */}
      <section
        id="alerts"
        className="border-b border-slate-200 bg-slate-50/80 px-4 py-12 sm:px-6 sm:py-16"
      >
        <div className="mx-auto max-w-4xl text-center">
          <h1
            className="text-2xl font-bold leading-snug tracking-tight sm:text-3xl md:text-[1.75rem] md:leading-tight"
            style={{ color: NAVY }}
          >
            학생 맞춤 통합지원,
            <br className="sm:hidden" />
            <span className="sm:ml-1">현장이 체감하는 디지털 행정</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600">
            관찰·진단·지원·사후관리를 하나의 포털 흐름으로 묶는{" "}
            <strong className="font-semibold text-slate-800">UI 목업</strong>
            입니다. 실제 저장·연동은 포함되지 않습니다.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded border-2 border-[#003876] bg-[#003876] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#002d5c]"
            >
              포털 열기
            </Link>
            <Link
              href="/exchange"
              className="inline-flex items-center justify-center rounded border-2 border-[#003876] bg-white px-6 py-2.5 text-sm font-semibold text-[#003876] hover:bg-slate-50"
            >
              통합지원신청
            </Link>
          </div>
        </div>
      </section>

      {/* Service icon grid */}
      <section id="services" className="px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2
            className="border-b-2 border-slate-200 pb-3 text-lg font-bold"
            style={{ color: NAVY }}
          >
            주요 서비스(목업)
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {serviceTiles.map((tile) => (
              <div
                key={tile.label}
                className="flex flex-col items-center justify-center border border-slate-200 bg-white p-4 text-center shadow-sm transition-shadow hover:shadow-md"
              >
                <div
                  className={`flex size-14 items-center justify-center rounded-full text-2xl font-light ${tile.tone}`}
                  aria-hidden
                >
                  ·
                </div>
                <p className="mt-3 text-xs font-medium leading-snug text-slate-800 sm:text-[13px]">
                  {tile.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <div style={{ backgroundColor: NAVY }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2 px-4 py-3 sm:justify-between sm:px-6">
          <p className="text-center text-sm font-medium text-white sm:text-left">
            지금 바로 관리 학생 명단과 통합지원신청 화면을 확인해 보세요.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              href="/dashboard"
              className="rounded bg-white px-4 py-2 text-xs font-semibold text-[#003876] hover:bg-slate-100 sm:text-sm"
            >
              바로가기
            </Link>
            <Link
              href="/exchange"
              className="rounded border border-white/60 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10 sm:text-sm"
            >
              신청 화면
            </Link>
          </div>
        </div>
      </div>

      {/* News / press */}
      <section id="features" className="bg-white px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2
            className="border-b-2 border-slate-200 pb-3 text-lg font-bold"
            style={{ color: NAVY }}
          >
            보도자료·알림(목업)
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {pressItems.map((item) => (
              <article
                key={item.title}
                className="flex flex-col border border-slate-200 bg-slate-50/50"
              >
                <div className="aspect-[5/3] bg-slate-200/90">
                  <div className="flex h-full items-center justify-center text-xs text-slate-500">
                    썸네일(목업)
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-[#003876]">
                    {item.cat}
                  </span>
                  <h3 className="mt-2 line-clamp-2 text-sm font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-600">
                    {item.excerpt}
                  </p>
                  <time
                    className="mt-3 text-xs tabular-nums text-slate-500"
                    dateTime={item.date}
                  >
                    {item.date}
                  </time>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Two column: media + notice */}
      <section className="border-t border-slate-200 bg-slate-50/50 px-4 py-12 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="border border-slate-200 bg-white p-5 shadow-sm">
            <h2
              className="text-base font-bold"
              style={{ color: NAVY }}
            >
              홍보·미디어(목업)
            </h2>
            <div className="mt-4">
              <LandingMediaTabs />
            </div>
          </div>
          <div className="border border-slate-200 bg-white p-5 shadow-sm">
            <h2
              className="text-base font-bold"
              style={{ color: NAVY }}
            >
              게시·안내
            </h2>
            <div className="mt-4">
              <LandingNoticeTabs />
            </div>
          </div>
        </div>
      </section>

      {/* SNS row */}
      <section className="px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold text-slate-500">@학맞통_EASY(목업)</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {["현장 스토리", "업데이트 안내", "협업 팁"].map((cap) => (
              <div
                key={cap}
                className="overflow-hidden border border-slate-200 bg-white shadow-sm"
              >
                <div className="aspect-square bg-slate-200/80">
                  <div className="flex h-full items-center justify-center text-xs text-slate-500">
                    이미지(목업)
                  </div>
                </div>
                <div className="p-3 text-xs text-slate-600">
                  <p className="font-medium text-slate-800">{cap}</p>
                  <p className="mt-1 text-slate-500">♥ 00 · 댓글(목업)</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dark briefing */}
      <section
        className="px-4 py-12 text-white sm:px-6"
        style={{ backgroundColor: "#001a33" }}
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="text-lg font-bold text-white">현장 브리핑(목업)</h2>
          <p className="mt-1 text-sm text-white/75">
            지자체·학교 현장 소식을 카드 형태로 모았습니다.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {briefingCards.map((c) => (
              <article
                key={c.title}
                className="overflow-hidden border border-white/15 bg-[#00294d]"
              >
                <div className="aspect-[4/3] bg-slate-700/50">
                  <div className="flex h-full items-center justify-center text-[10px] text-white/50">
                    사진(목업)
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-bold leading-snug text-white">
                    {c.title}
                  </h3>
                  <p className="mt-1 text-xs text-white/70">{c.sub}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Security + FAQ */}
      <section id="security" className="px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2
            className="border-b-2 border-slate-200 pb-3 text-lg font-bold"
            style={{ color: NAVY }}
          >
            보안·개인정보
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600">
            이 화면의 데이터는 브라우저 내부에서만 처리되는{" "}
            <strong className="text-slate-800">프로토타입</strong>입니다. 전송·
            서버 저장 로직은 없습니다.
          </p>
        </div>
      </section>

      <section id="faq" className="border-t border-slate-200 bg-slate-50/60 px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2
            className="border-b-2 border-slate-200 pb-3 text-lg font-bold"
            style={{ color: NAVY }}
          >
            자주 묻는 질문
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <details className="border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <summary className="cursor-pointer text-sm font-semibold text-slate-900">
                데이터 전송 여부
              </summary>
              <p className="mt-2 text-sm text-slate-600">목업이며 전송하지 않습니다.</p>
            </details>
            <details className="border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <summary className="cursor-pointer text-sm font-semibold text-slate-900">
                AI 추천 결과
              </summary>
              <p className="mt-2 text-sm text-slate-600">
                규칙 기반 예시 출력입니다.
              </p>
            </details>
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/dashboard"
              className="inline-block rounded border-2 border-[#003876] px-6 py-2.5 text-sm font-semibold text-[#003876] hover:bg-[#003876] hover:text-white"
            >
              포털로 이동
            </Link>
          </div>
        </div>
      </section>

      <PrivacyFooter />
    </div>
  );
}
