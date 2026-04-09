"use client";

import { useEffect, useRef, useState } from "react";
import {
  initialChatMessages,
  yieldFeed,
  type ObservationRole,
} from "@/lib/mock-data";

type ChatRow = { id: string; author: string; text: string; time: string };

function timeNow() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function YieldClient() {
  const [feed, setFeed] = useState(yieldFeed);
  const [newNote, setNewNote] = useState("");
  const [chat, setChat] = useState<ChatRow[]>(initialChatMessages as ChatRow[]);
  const [chatInput, setChatInput] = useState("");
  const [reportMsg, setReportMsg] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [chat]);

  function addFeedNote(e: React.FormEvent) {
    e.preventDefault();
    if (!newNote.trim()) return;
    setFeed((prev) => [
      {
        id: `y-${Date.now()}`,
        author: "나(목업)",
        role: "총괄" as ObservationRole,
        content: newNote.trim(),
        date: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
    setNewNote("");
  }

  function sendChat(e: React.FormEvent) {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChat((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        author: "나(목업)",
        text: chatInput.trim(),
        time: timeNow(),
      },
    ]);
    setChatInput("");
  }

  function generateReport(period: "weekly" | "monthly") {
    const label = period === "weekly" ? "주간" : "월간";
    setReportMsg(
      `${label} 리포트 초안이 생성되었습니다(목업). 피드 ${feed.length}건 · 메시지 ${chat.length}건.`,
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-900">
          사후 변화 공유
        </h2>
        <form onSubmit={addFeedNote} className="flex gap-2">
          <input
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="변화·관찰 기록"
            className="min-w-0 flex-1 border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-slate-400"
          />
          <button
            type="submit"
            className="border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            등록
          </button>
        </form>
        <ul className="divide-y divide-slate-200 border-t border-slate-200">
          {feed.map((item) => (
            <li key={item.id} className="py-3">
              <p className="text-xs text-slate-500">
                {item.author} · {item.role} · {item.date}
              </p>
              <p className="mt-1 text-sm text-slate-800">{item.content}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-900">협업 메시지</h2>
          <p className="text-xs text-slate-500">목업 화면입니다.</p>
        </div>
        <div
          ref={listRef}
          className="max-h-64 flex-1 space-y-3 overflow-y-auto px-4 py-3"
        >
          {chat.map((m) => (
            <div key={m.id} className="border-b border-slate-100 pb-3 text-sm last:border-0">
              <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                <span>{m.author}</span>
                <span>{m.time}</span>
              </div>
              <p className="mt-1 text-slate-800">{m.text}</p>
            </div>
          ))}
        </div>
        <form
          onSubmit={sendChat}
          className="flex gap-2 border-t border-slate-100 p-3"
        >
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="메시지"
            className="min-w-0 flex-1 border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-slate-400"
          />
          <button
            type="submit"
            className="shrink-0 border border-slate-900 px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
          >
            전송
          </button>
        </form>

        <div className="border-t border-slate-100 px-4 py-4">
          <p className="text-xs font-medium text-slate-700">리포트</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => generateReport("weekly")}
              className="border border-slate-200 px-3 py-2 text-xs text-slate-800 hover:border-slate-900"
            >
              주간
            </button>
            <button
              type="button"
              onClick={() => generateReport("monthly")}
              className="border border-slate-200 px-3 py-2 text-xs text-slate-800 hover:border-slate-900"
            >
              월간
            </button>
          </div>
          {reportMsg && (
            <p className="mt-3 text-xs text-slate-600">{reportMsg}</p>
          )}
        </div>
      </section>
    </div>
  );
}
