import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zero2Run - 러닝 마일리지",
  description: "러닝 크루 월별 마일리지 현황",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <nav className="bg-[#1a1a1a] text-white px-6 py-3.5 flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo.jpg"
              alt="Zero2Run"
              width={40}
              height={40}
              className="rounded-lg group-hover:scale-105 transition-transform"
            />
            <span className="text-sm font-semibold tracking-tight hidden sm:block">
              Zero2Run
            </span>
          </Link>
          <div className="flex items-center gap-1">
            <Link
              href="/"
              className="text-[13px] text-gray-400 hover:text-white px-3 py-1.5 rounded-md hover:bg-white/10 transition-colors"
            >
              현황
            </Link>
            <Link
              href="/hall-of-fame"
              className="text-[13px] text-gray-400 hover:text-white px-3 py-1.5 rounded-md hover:bg-white/10 transition-colors"
            >
              명예의 전당
            </Link>
          </div>
          <Link
            href="/admin"
            className="text-[13px] text-gray-500 hover:text-white ml-auto px-3 py-1.5 rounded-md hover:bg-white/10 transition-colors"
          >
            관리
          </Link>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
