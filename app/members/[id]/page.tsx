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
      <div className="max-w-[800px] mx-auto p-6 text-center text-gray-400">
        불러오는 중...
      </div>
    );
  }

  if (!member) {
    return (
      <div className="max-w-[800px] mx-auto p-6 text-center text-gray-400">
        회원을 찾을 수 없습니다
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto p-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-gray-400 text-sm mb-4 hover:text-gray-600"
      >
        &lsaquo; 전체 현황
      </Link>
      <h2 className="text-xl font-bold mb-5">
        {member.name}
        <span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-2 py-0.5 rounded-full ml-2">
          {formatMonth(month)} {selectedMonthTotal}km
        </span>
      </h2>

      <div className="bg-white rounded-xl p-5 shadow-sm mb-4">
        <div className="text-sm text-gray-400 font-semibold mb-3">
          월별 추이
        </div>
        <MonthlyChart data={monthlyData} />
      </div>

      <RecordForm memberId={id} onSaved={loadData} />

      <div className="bg-white rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={goToPrevMonth}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 text-lg"
          >
            &lsaquo;
          </button>
          <div className="text-sm text-gray-400 font-semibold">
            {formatMonth(month)} 기록
          </div>
          <button
            onClick={goToNextMonth}
            disabled={isCurrentMonth}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 text-lg disabled:opacity-0 disabled:cursor-default"
          >
            &rsaquo;
          </button>
        </div>
        {records.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-400 font-semibold border-b-2 border-gray-100">
                <th className="pb-2">날짜</th>
                <th className="pb-2">거리</th>
                <th className="pb-2">메모</th>
                <th className="pb-2 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-gray-50 text-sm"
                >
                  <td className="py-2.5">
                    {record.date.slice(5).replace("-", "/")}
                  </td>
                  <td className="py-2.5 text-blue-600 font-semibold">
                    {record.distance_km} km
                  </td>
                  <td className="py-2.5 text-gray-400 text-xs">
                    {record.memo}
                  </td>
                  <td className="py-2.5 text-right">
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="text-gray-300 hover:text-red-500 text-xs"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-gray-400 text-sm text-center py-4">
            이 달의 기록이 없습니다
          </div>
        )}
      </div>
    </div>
  );
}
