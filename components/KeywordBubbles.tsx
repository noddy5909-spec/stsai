import { aiKeywords } from "@/lib/mock-data";

export function KeywordBubbles() {
  return (
    <ul className="flex flex-wrap gap-2 border border-slate-200 bg-white p-4">
      {aiKeywords.map((kw) => (
        <li
          key={kw.label}
          className="border border-slate-200 px-2.5 py-1 text-xs text-slate-700"
        >
          {kw.label}{" "}
          <span className="text-slate-400">{kw.weight}%</span>
        </li>
      ))}
    </ul>
  );
}
