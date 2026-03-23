"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import Image from "next/image";

interface AuthContextType {
  authenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  authenticated: false,
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [crewName, setCrewName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("crew_authenticated");
    if (saved === "true") {
      setAuthenticated(true);
    }
    setChecking(false);
  }, []);

  async function handleLogin() {
    if (!crewName.trim() || !password.trim() || loading) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crewName: crewName.trim(), password: password.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "인증에 실패했습니다");
        return;
      }

      sessionStorage.setItem("crew_authenticated", "true");
      setAuthenticated(true);
    } catch {
      setError("서버에 연결할 수 없습니다");
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    sessionStorage.removeItem("crew_authenticated");
    setAuthenticated(false);
  }

  if (checking) {
    return null;
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafaf8] px-5">
        <div className="w-full max-w-[360px]">
          <div className="flex flex-col items-center mb-8">
            <Image
              src="/logo.jpg"
              alt="Zero2Run"
              width={64}
              height={64}
              className="rounded-2xl mb-4"
            />
            <h1 className="text-xl font-bold tracking-tight">Zero2Run</h1>
            <p className="text-sm text-[#a3a3a3] mt-1">러닝 크루 마일리지</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#e8e8e4]">
            <div className="space-y-3">
              <input
                type="text"
                value={crewName}
                onChange={(e) => setCrewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="크루명"
                className="w-full border border-[#e8e8e4] rounded-lg px-3.5 py-2.5 text-sm bg-white focus:border-[#0d9668] transition-colors"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="비밀번호"
                className="w-full border border-[#e8e8e4] rounded-lg px-3.5 py-2.5 text-sm bg-white focus:border-[#0d9668] transition-colors"
              />
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-[#0d9668] text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-[#0a7d56] active:bg-[#065f46] disabled:opacity-50 transition-colors"
              >
                {loading ? "확인 중..." : "입장하기"}
              </button>
            </div>
            {error && (
              <div className="text-red-500 text-sm mt-3 text-center">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ authenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
