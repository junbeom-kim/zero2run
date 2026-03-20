"use client";

import { useState } from "react";

interface RecordRow {
  date: string;
  distance_km: string;
  memo: string;
}

interface RecordFormProps {
  memberId: string;
  onSaved: () => void;
}

export default function RecordForm({ memberId, onSaved }: RecordFormProps) {
  const today = new Date().toISOString().split("T")[0];
  const [rows, setRows] = useState<RecordRow[]>([
    { date: today, distance_km: "", memo: "" },
  ]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function addRow() {
    setRows([...rows, { date: today, distance_km: "", memo: "" }]);
  }

  function removeRow(index: number) {
    if (rows.length <= 1) return;
    setRows(rows.filter((_, i) => i !== index));
  }

  function updateRow(index: number, field: keyof RecordRow, value: string) {
    const updated = [...rows];
    updated[index] = { ...updated[index], [field]: value };
    setRows(updated);
  }

  async function handleSubmit() {
    setError("");
    const entries = rows
      .filter((r) => r.date && r.distance_km)
      .map((r) => ({
        member_id: memberId,
        date: r.date,
        distance_km: parseFloat(r.distance_km),
        memo: r.memo,
      }));

    if (entries.length === 0) {
      setError("날짜와 거리를 입력해주세요");
      return;
    }

    if (entries.some((e) => isNaN(e.distance_km) || e.distance_km <= 0)) {
      setError("거리는 0보다 큰 숫자를 입력해주세요");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ records: entries }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "저장에 실패했습니다");
      }

      setRows([{ date: today, distance_km: "", memo: "" }]);
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했습니다");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#e8e8e4] mb-4">
      <div className="text-xs text-[#a3a3a3] font-medium mb-4 tracking-wide">
        기록 추가
      </div>
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              type="date"
              value={row.date}
              onChange={(e) => updateRow(i, "date", e.target.value)}
              className="flex-[1.2] border border-[#e8e8e4] rounded-lg px-3 py-2.5 text-sm bg-white focus:border-[#0d9668] transition-colors"
            />
            <input
              type="number"
              placeholder="km"
              step="0.1"
              min="0"
              value={row.distance_km}
              onChange={(e) => updateRow(i, "distance_km", e.target.value)}
              className="w-20 border border-[#e8e8e4] rounded-lg px-3 py-2.5 text-sm bg-white focus:border-[#0d9668] tabular-nums transition-colors"
            />
            <input
              type="text"
              placeholder="메모 (선택)"
              value={row.memo}
              onChange={(e) => updateRow(i, "memo", e.target.value)}
              className="flex-[1.5] border border-[#e8e8e4] rounded-lg px-3 py-2.5 text-sm bg-white focus:border-[#0d9668] transition-colors"
            />
            <button
              onClick={() => removeRow(i)}
              className="text-[#d1d5db] hover:text-red-500 text-lg px-1.5 transition-colors"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={addRow}
        className="w-full mt-3 border border-dashed border-[#d1d5db] rounded-lg py-2.5 text-sm text-[#a3a3a3] hover:border-[#0d9668] hover:text-[#0d9668] transition-colors"
      >
        + 행 추가
      </button>
      {error && (
        <div className="text-red-500 text-sm mt-2">{error}</div>
      )}
      <button
        onClick={handleSubmit}
        disabled={saving}
        className="w-full mt-3 bg-[#0d9668] text-white rounded-lg py-3 text-sm font-semibold hover:bg-[#0a7d56] active:bg-[#065f46] disabled:opacity-50 transition-colors"
      >
        {saving ? "저장 중..." : "저장"}
      </button>
    </div>
  );
}
