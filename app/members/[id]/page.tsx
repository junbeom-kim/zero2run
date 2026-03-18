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

export default function MemberPage() {
  const params = useParams();
  const id = params.id as string;

  const [member, setMember] = useState<Member | null>(null);
  const [records, setRecords] = useState<Record[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const currentMonthLabel = `${now.getFullYear()}년 ${now.getMonth() + 1}월`;

  const loadData = useCallback(async () => {
    try {
      const [memberRes, recordsRes, statsRes] = await Promise.all([
        fetch(`/api/members/${id}`),
        fetch(`/api/records?memberId=${id}&month=${currentMonth}`),
        fetch(`/api/stats`),
      ]);

      const memberData = await memberRes.json();
      const recordsData = await recordsRes.json();
      const statsData = await statsRes.json();

      setMember(memberData);
      setRecords(recordsData);

      // Extract this member's monthly data from stats
      // Or fetch all records for this member to compute monthly
      const allRecordsRes = await fetch(`/api/records?memberId=${id}`);
      const allRecords = await allRecordsRes.json();

      const monthlyTotals: { [month: string]: number } = {};
      for (const r of allRecords) {
        const month = r.date.slice(0, 7);
        monthlyTotals[month] = (monthlyTotals[month] || 0) + r.distance_km;
      }

      const months: string[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
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
  }, [id, currentMonth]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const currentMonthTotal =
    monthlyData.find((m) => m.month === currentMonth)?.total || 0;

  if (loading) {
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
          이번 달 {currentMonthTotal}km
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
        <div className="text-sm text-gray-400 font-semibold mb-3">
          {currentMonthLabel} 기록
        </div>
        {records.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-400 font-semibold border-b-2 border-gray-100">
                <th className="pb-2">날짜</th>
                <th className="pb-2">거리</th>
                <th className="pb-2">메모</th>
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
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-gray-400 text-sm text-center py-4">
            이번 달 기록이 없습니다
          </div>
        )}
      </div>
    </div>
  );
}
