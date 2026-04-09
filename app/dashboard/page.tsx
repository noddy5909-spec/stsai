import Link from "next/link";
import {
  collaborationFeed,
  todayTasks,
} from "@/lib/mock-data";
import { ManagedStudentsWithTabs } from "@/components/ManagedStudentsWithTabs";

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start lg:gap-8">
      <div className="min-w-0 lg:col-span-8">
        <ManagedStudentsWithTabs />
      </div>

      <aside className="min-w-0 space-y-6 lg:col-span-4">
        <section className="border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-[#003876]">오늘의 할 일</h2>
          <ul className="mt-4 divide-y divide-slate-100 border-t border-slate-100">
            {todayTasks.map((task) => (
              <li
                key={task.id}
                className="flex items-start justify-between gap-3 py-3"
              >
                <div>
                  <p className="text-sm text-slate-800">{task.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{task.due}</p>
                </div>
                {task.urgent && (
                  <span className="shrink-0 text-xs text-slate-600">긴급</span>
                )}
              </li>
            ))}
          </ul>
          <Link
            href="/exchange"
            className="mt-4 inline-block text-sm text-slate-700 underline underline-offset-2 hover:text-slate-900"
          >
            통합지원신청으로 이동
          </Link>
        </section>

        <section className="border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-[#003876]">
            부서별 협업 알림
          </h2>
          <ul className="mt-4 divide-y divide-slate-100 border-t border-slate-100">
            {collaborationFeed.map((item) => (
              <li key={item.id} className="py-3">
                <p className="text-xs font-medium text-slate-700">{item.dept}</p>
                <p className="mt-1 text-sm text-slate-700">{item.message}</p>
                <p className="mt-1 text-xs text-slate-400">{item.time}</p>
              </li>
            ))}
          </ul>
        </section>
      </aside>
    </div>
  );
}
