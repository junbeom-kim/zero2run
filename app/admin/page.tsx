"use client";

import { useState, useEffect } from "react";

interface Member {
  id: string;
  name: string;
  created_at: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [name, setName] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_password");
    if (saved) {
      setPassword(saved);
      setAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      loadMembers();
    }
  }, [authenticated]);

  async function loadMembers() {
    try {
      const res = await fetch("/api/members");
      const data = await res.json();
      setMembers(data);
    } catch {
      console.error("Failed to load members");
    }
  }

  function handleLogin() {
    if (!password.trim()) return;
    sessionStorage.setItem("admin_password", password);
    setAuthenticated(true);
  }

  async function handleAddMember() {
    if (!name.trim() || loading) return;
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), password: password.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          setAuthenticated(false);
          sessionStorage.removeItem("admin_password");
        }
        throw new Error(data.error || "등록에 실패했습니다");
      }

      setSuccess(`"${data.name}" 회원이 등록되었습니다`);
      setName("");
      loadMembers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "등록에 실패했습니다");
    } finally {
      setLoading(false);
    }
  }

  if (!authenticated) {
    return (
      <div className="max-w-[800px] mx-auto p-6">
        <h2 className="text-xl font-bold mb-5">관리자</h2>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="text-sm text-gray-400 font-semibold mb-3">
            비밀번호 입력
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="관리자 비밀번호"
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-600"
            />
            <button
              onClick={handleLogin}
              className="bg-blue-600 text-white rounded-lg px-6 py-2.5 text-sm font-semibold hover:bg-blue-700"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto p-6">
      <h2 className="text-xl font-bold mb-5">관리자</h2>

      <div className="bg-white rounded-xl p-5 shadow-sm mb-4">
        <div className="text-sm text-gray-400 font-semibold mb-3">
          회원 등록
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddMember()}
            placeholder="회원 이름"
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-600"
          />
          <button
            onClick={handleAddMember}
            disabled={loading}
            className="bg-blue-600 text-white rounded-lg px-6 py-2.5 text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "등록 중..." : "등록"}
          </button>
        </div>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        {success && (
          <div className="text-green-600 text-sm mt-2">{success}</div>
        )}
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm">
        <div className="text-sm text-gray-400 font-semibold mb-3">
          등록된 회원 ({members.length}명)
        </div>
        {members.map((member) => (
          <div
            key={member.id}
            className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
          >
            <span className="font-semibold">{member.name}</span>
            <span className="text-xs text-gray-400">{member.created_at}</span>
          </div>
        ))}
        {members.length === 0 && (
          <div className="text-gray-400 text-sm text-center py-4">
            등록된 회원이 없습니다
          </div>
        )}
      </div>
    </div>
  );
}
