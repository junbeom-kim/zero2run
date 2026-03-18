"use client";

import { useEffect, useState } from "react";
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

function formatCurrentMonth(month: string) {
  const [year, m] = month.split("-");
  return `${year}년 ${parseInt(m)}월`;
}

export default function MainPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-[800px] mx-auto p-6 text-center text-gray-400">
        불러오는 중...
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="max-w-[800px] mx-auto p-6 text-center text-gray-400">
        데이터를 불러올 수 없습니다
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto p-6">
      <h2 className="text-xl font-bold mb-5">
        {formatCurrentMonth(stats.currentMonth)} 전체 현황
      </h2>

      <StatsCard
        totalDistance={stats.totalDistance}
        participatingCount={stats.participatingCount}
        avgDistance={stats.avgDistance}
      />

      <div className="bg-white rounded-xl p-5 shadow-sm mt-4">
        <div className="text-sm text-gray-400 font-semibold mb-3">
          월별 추이 (전체)
        </div>
        <MonthlyChart data={stats.monthlyChart} />
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm mt-4">
        <div className="text-sm text-gray-400 font-semibold mb-3">
          회원별 현황
        </div>
        {stats.memberStats.map((member) => (
          <Link
            key={member.id}
            href={`/members/${member.id}`}
            className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 -mx-5 px-5 rounded-lg"
          >
            <span className="font-semibold">{member.name}</span>
            <span>
              <span className="text-blue-600 font-semibold">
                {member.currentMonthKm} km
              </span>
              <span className="text-gray-300 ml-2">&rsaquo;</span>
            </span>
          </Link>
        ))}
        {stats.memberStats.length === 0 && (
          <div className="text-gray-400 text-sm text-center py-4">
            등록된 회원이 없습니다
          </div>
        )}
      </div>
    </div>
  );
}
