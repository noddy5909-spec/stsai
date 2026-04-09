"use client";

import { useState } from "react";
import { mockNearbyInstitutions, type WelfareInstitution } from "@/lib/mock-data";

export function SupportInstitutions() {
  const [selected, setSelected] = useState<WelfareInstitution | null>(
    mockNearbyInstitutions[0] ?? null,
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">위치 안내(목업)</h3>
        <p className="mt-1 text-xs text-slate-500">
          가상 데이터입니다. 항목을 선택하면 강조됩니다.
        </p>
        <div
          className="relative mt-3 aspect-[4/3] border border-slate-200 bg-white"
          role="img"
          aria-label="기관 위치 목업"
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-xs text-slate-500">
            학교
          </div>
          {mockNearbyInstitutions.map((inst) => {
            const active = selected?.id === inst.id;
            return (
              <button
                key={inst.id}
                type="button"
                onClick={() => setSelected(inst)}
                className={`absolute rounded border px-1.5 py-0.5 text-[10px] ${
                  active
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:border-slate-900"
                }`}
                style={{
                  left: `${inst.lng * 100}%`,
                  top: `${inst.lat * 100}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {inst.type}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900">추천 기관</h3>
        <ul className="mt-3 divide-y divide-slate-200 border-t border-slate-200">
          {mockNearbyInstitutions.map((inst) => (
            <li key={inst.id}>
              <button
                type="button"
                onClick={() => setSelected(inst)}
                className={`w-full py-3 text-left ${
                  selected?.id === inst.id ? "text-slate-900" : "text-slate-600"
                }`}
              >
                <p className="text-sm font-medium text-slate-900">{inst.name}</p>
                <p className="mt-1 text-xs text-slate-500">
                  약 {inst.distanceKm}km · {inst.type}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">{inst.phone}</p>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
