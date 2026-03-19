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
      <body className="antialiased">
        <nav className="bg-[#2d2d2d] text-white px-6 py-4 flex items-center gap-6">
          <Link href="/">
            <Image src="/logo.jpg" alt="Zero2Run" width={48} height={48} className="rounded" />
          </Link>
          <Link href="/" className="text-sm text-gray-400 hover:text-white">
            전체 현황
          </Link>
          <Link
            href="/admin"
            className="text-sm text-gray-400 hover:text-white ml-auto"
          >
            관리자
          </Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
