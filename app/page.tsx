"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import StatsCard from "@/components/StatsCard";
import MonthlyChart from "@/components/MonthlyChart";

interface Stats {
  currentMonth: string;
  totalDistance: number;
  participatingCount: number;
  avgDistance: number;
  monthlyChart: { month: string; total: number }[];
  memberStats: { id: string; name: string; currentMonthKm: number }[];
}

function formatMonth(month: string) {
  const [year, m] = month.split("-");
  return `${year}년 ${parseInt(m)}월`;
}

function getAdjacentMonth(month: string, offset: number) {
  const [year, mon] = month.split("-").map(Number);
  const d = new Date(year, mon - 1 + offset, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export default function MainPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(getCurrentMonth);

  const fetchStats = useCallback((m: string) => {
    setLoading(true);
    fetch(`/api/stats?month=${m}`)
      .then((res) => res.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchStats(month);
  }, [month, fetchStats]);

  const goToPrevMonth = () => setMonth((m) => getAdjacentMonth(m, -1));
  const goToNextMonth = () => setMonth((m) => getAdjacentMonth(m, 1));
  const isCurrentMonth = month === getCurrentMonth();

  if (loading && !stats) {
    return (
      <div className="max-w-[800px] mx-auto p-6 text-center text-[#a3a3a3] py-20">
        불러오는 중...
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="max-w-[800px] mx-auto p-6 text-center text-[#a3a3a3] py-20">
        데이터를 불러올 수 없습니다
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto px-5 py-8">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPrevMonth}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#e8e8e4] text-[#6b6b6b] text-lg transition-colors"
        >
          &lsaquo;
        </button>
        <h2 className="text-lg font-bold tracking-tight">
          {formatMonth(stats.currentMonth)}
        </h2>
        <button
          onClick={goToNextMonth}
          disabled={isCurrentMonth}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#e8e8e4] text-[#6b6b6b] text-lg transition-colors disabled:opacity-0 disabled:cursor-default"
        >
          &rsaquo;
        </button>
      </div>

      {/* Stats */}
      <StatsCard
        totalDistance={stats.totalDistance}
        participatingCount={stats.participatingCount}
        avgDistance={stats.avgDistance}
      />

      {/* Monthly trend */}
      <div className="bg-white rounded-2xl p-5 border border-[#e8e8e4] mt-4">
        <div className="text-xs text-[#a3a3a3] font-medium mb-4 tracking-wide">
          월별 추이
        </div>
        <MonthlyChart data={stats.monthlyChart} />
      </div>

      {/* Member list */}
      <div className="bg-white rounded-2xl border border-[#e8e8e4] mt-4 overflow-hidden">
        <div className="text-xs text-[#a3a3a3] font-medium px-5 pt-5 pb-2 tracking-wide">
          회원별 현황
        </div>
        {stats.memberStats.map((member, i) => (
          <Link
            key={member.id}
            href={`/members/${member.id}`}
            className="flex justify-between items-center py-3.5 px-5 hover:bg-[#fafaf8] transition-colors group"
            style={{
              borderBottom:
                i < stats.memberStats.length - 1
                  ? "1px solid #f0f0ec"
                  : "none",
            }}
          >
            <span className="font-semibold text-[15px]">{member.name}</span>
            <span className="flex items-center gap-2">
              <span className="text-[#0d9668] font-semibold tabular-nums text-[15px]">
                {member.currentMonthKm}
                <span className="text-xs font-medium text-[#a3a3a3] ml-0.5">
                  km
                </span>
              </span>
              <span className="text-[#d1d5db] group-hover:text-[#a3a3a3] group-hover:translate-x-0.5 transition-all text-sm">
                &rsaquo;
              </span>
            </span>
          </Link>
        ))}
        {stats.memberStats.length === 0 && (
          <div className="text-[#a3a3a3] text-sm text-center py-8">
            등록된 회원이 없습니다
          </div>
        )}
      </div>
    </div>
  );
}
