import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PortalLayout } from "@/components/PortalLayout";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "학맞통 EASY | 학생맞춤통합지원 행정 자동화",
  description:
    "관찰·진단·지원·사후관리 4단계 프로세스를 하나의 포털에서 — 교육 현장 맞춤형 프로토타입",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <PortalLayout>{children}</PortalLayout>
      </body>
    </html>
  );
}
