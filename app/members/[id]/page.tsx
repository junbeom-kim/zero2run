"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import MonthlyChart from "@/components/MonthlyChart";
import RecordForm from "@/components/RecordForm";

interface Member {
  id: string;
  name: string;
}

interface Record {
  id: string;
  date: string;
  distance_km: number;
  memo: string;
}

interface MonthlyData {
  month: string;
  total: number;
}

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function getAdjacentMonth(month: string, offset: number) {
  const [year, mon] = month.split("-").map(Number);
  const d = new Date(year, mon - 1 + offset, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonth(month: string) {
  const [year, m] = month.split("-");
  return `${year}년 ${parseInt(m)}월`;
}

export default function MemberPage() {
  const params = useParams();
  const id = params.id as string;

  const [member, setMember] = useState<Member | null>(null);
  const [records, setRecords] = useState<Record[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(getCurrentMonth);

  const loadData = useCallback(async () => {
    try {
      const [memberRes, recordsRes, allRecordsRes] = await Promise.all([
        fetch(`/api/members/${id}`),
        fetch(`/api/records?memberId=${id}&month=${month}`),
        fetch(`/api/records?memberId=${id}`),
      ]);

      const memberData = await memberRes.json();
      const recordsData = await recordsRes.json();
      const allRecords = await allRecordsRes.json();

      setMember(memberData);
      setRecords(recordsData);

      const monthlyTotals: { [m: string]: number } = {};
      for (const r of allRecords) {
        const m = r.date.slice(0, 7);
        monthlyTotals[m] = (monthlyTotals[m] || 0) + r.distance_km;
      }

      const [year, mon] = month.split("-").map(Number);
      const months: string[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(year, mon - 1 - i, 1);
        months.push(
          `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
        );
      }

      setMonthlyData(
        months.map((m) => ({
          month: m,
          total: Math.round((monthlyTotals[m] || 0) * 10) / 10,
        }))
      );
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  }, [id, month]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = async (recordId: string) => {
    if (!confirm("이 기록을 삭제하시겠습니까?")) return;
    try {
      const res = await fetch("/api/records", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: recordId }),
      });
      if (res.ok) {
        loadData();
      }
    } catch (error) {
      console.error("Failed to delete record:", error);
    }
  };

  const selectedMonthTotal =
    monthlyData.find((m) => m.month === month)?.total || 0;
  const isCurrentMonth = month === getCurrentMonth();

  const goToPrevMonth = () => setMonth((m) => getAdjacentMonth(m, -1));
  const goToNextMonth = () => setMonth((m) => getAdjacentMonth(m, 1));

  if (loading && !member) {
    return (
      <div className="max-w-[800px] mx-auto p-6 text-center text-[#a3a3a3] py-20">
        불러오는 중...
      </div>
    );
  }

  if (!member) {
    return (
      <div className="max-w-[800px] mx-auto p-6 text-center text-[#a3a3a3] py-20">
        회원을 찾을 수 없습니다
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto px-5 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-[#a3a3a3] text-sm mb-5 hover:text-[#6b6b6b] transition-colors"
      >
        &lsaquo; 전체 현황
      </Link>

      <div className="flex items-baseline gap-3 mb-6">
        <h2 className="text-lg font-bold tracking-tight">{member.name}</h2>
        <span className="text-sm font-semibold text-[#0d9668] tabular-nums">
          {formatMonth(month)} {selectedMonthTotal}km
        </span>
      </div>

      {/* Monthly trend */}
      <div className="bg-white rounded-2xl p-5 border border-[#e8e8e4] mb-4">
        <div className="text-xs text-[#a3a3a3] font-medium mb-4 tracking-wide">
          월별 추이
        </div>
        <MonthlyChart data={monthlyData} />
      </div>

      {/* Record form */}
      <RecordForm memberId={id} onSaved={loadData} />

      {/* Records table */}
      <div className="bg-white rounded-2xl p-5 border border-[#e8e8e4]">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goToPrevMonth}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f0f0ec] text-[#6b6b6b] text-lg transition-colors"
          >
            &lsaquo;
          </button>
          <div className="text-xs text-[#a3a3a3] font-medium tracking-wide">
            {formatMonth(month)} 기록
          </div>
          <button
            onClick={goToNextMonth}
            disabled={isCurrentMonth}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f0f0ec] text-[#6b6b6b] text-lg transition-colors disabled:opacity-0 disabled:cursor-default"
          >
            &rsaquo;
          </button>
        </div>
        {records.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="text-left text-[11px] text-[#a3a3a3] font-medium border-b border-[#e8e8e4]">
                <th className="pb-2.5">날짜</th>
                <th className="pb-2.5">거리</th>
                <th className="pb-2.5">메모</th>
                <th className="pb-2.5 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-[#f5f5f0] last:border-b-0 text-sm"
                >
                  <td className="py-3 tabular-nums text-[#6b6b6b]">
                    {record.date.slice(5).replace("-", "/")}
                  </td>
                  <td className="py-3 text-[#0d9668] font-semibold tabular-nums">
                    {record.distance_km} km
                  </td>
                  <td className="py-3 text-[#a3a3a3] text-xs">
                    {record.memo}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="text-[#d1d5db] hover:text-red-500 text-xs transition-colors"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-[#a3a3a3] text-sm text-center py-8">
            이 달의 기록이 없습니다
          </div>
        )}
      </div>
    </div>
  );
}
