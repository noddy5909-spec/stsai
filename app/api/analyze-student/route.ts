import { NextResponse } from "next/server";

/** 외부 분석 API (서버에서만 사용). 클라이언트는 `/api/analyze-student`로만 호출합니다. */
const UPSTREAM_URL =
  process.env.ANALYZE_STUDENT_UPSTREAM_URL ??
  "https://met-nothing-soundtrack-among.trycloudflare.com/api/analyze-student";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "요청 본문이 올바른 JSON이 아닙니다." }, { status: 400 });
  }

  console.log("\n========== [analyze-student] 요청 본문 (클라이언트 → Next) ==========");
  console.log(JSON.stringify(body, null, 2));
  console.log("========== [analyze-student] 업스트림 URL ==========");
  console.log(UPSTREAM_URL);

  let upstreamRes: Response;
  try {
    upstreamRes = await fetch(UPSTREAM_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (e) {
    console.error("[analyze-student] 업스트림 fetch 실패:", e);
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "업스트림 연결 실패" },
      { status: 502 },
    );
  }

  const text = await upstreamRes.text();
  let logBody = text;
  try {
    logBody = JSON.stringify(JSON.parse(text), null, 2);
  } catch {
    // JSON이 아니면 원문 그대로
  }

  console.log("\n========== [analyze-student] 업스트림 응답 ==========");
  console.log("status:", upstreamRes.status);
  console.log(logBody);
  console.log("====================================================\n");

  const ct = upstreamRes.headers.get("content-type") ?? "application/json; charset=utf-8";
  return new NextResponse(text, {
    status: upstreamRes.status,
    headers: { "Content-Type": ct },
  });
}
