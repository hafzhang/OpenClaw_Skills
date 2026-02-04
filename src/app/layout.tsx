import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: {
    default: "OpenClaw 实战指南 - 教程为主，技能索引为辅",
    template: "%s | OpenClaw 实战指南"
  },
  description: "OpenClaw 实战指南 - 30 个真实案例，让 AI 助手真正帮你工作。包含快速入门教程、工作效率技巧、开发辅助等实战内容。",
  keywords: ["OpenClaw", "OpenClaw 教程", "OpenClaw 实战", "OpenClaw 中文指南", "AI 助手", "Claude Code", "实战教程"],
  authors: [{ name: "OpenClaw 社区" }],
  creator: "OpenClaw 社区",
  publisher: "OpenClaw 社区",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://openclaw-hub.vercel.app"),
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://openclaw-hub.vercel.app",
    title: "OpenClaw 实战指南 - 教程为主，技能索引为辅",
    description: "30 个真实案例，让 AI 助手真正帮你工作",
    siteName: "OpenClaw 实战指南",
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenClaw 实战指南 - 教程为主，技能索引为辅",
    description: "30 个真实案例，让 AI 助手真正帮你工作",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
