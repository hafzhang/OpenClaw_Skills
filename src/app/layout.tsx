import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme";

// 确保生产环境使用正确的域名
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.clawtools.dev';

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
  description: "OpenClaw 实战指南 - 30+ 个真实案例，让 AI 助手真正帮你工作。包含快速入门教程、工作效率技巧、开发辅助等实战内容。涵盖 1500+ MCP 技能索引，是 Claude Code 和 OpenClaw 的权威中文学习资源。",
  keywords: [
    "OpenClaw",
    "OpenClaw 教程",
    "OpenClaw 实战",
    "OpenClaw 中文指南",
    "Claude Code",
    "Claude AI",
    "AI 助手",
    "MCP 服务器",
    "MCP 技能",
    "实战教程",
    "AI 工作流"
  ],
  authors: [{ name: "OpenClaw 社区", url: SITE_URL }],
  creator: "OpenClaw 社区",
  publisher: "OpenClaw 社区",
  category: "technology",
  classification: "educational",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
    languages: {
      "zh-CN": SITE_URL,
      "en": `${SITE_URL}/en`,
    },
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: SITE_URL,
    title: "OpenClaw 实战指南 - 教程为主，技能索引为辅",
    description: "30+ 个真实案例，让 AI 助手真正帮你工作。涵盖 1500+ MCP 技能索引，Claude Code 和 OpenClaw 的权威中文学习资源。",
    siteName: "OpenClaw 实战指南",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "OpenClaw 实战指南",
      },
      {
        url: "/og-image-square.png",
        width: 1200,
        height: 1200,
        alt: "OpenClaw 实战指南",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@openclaw",
    creator: "@openclaw",
    title: "OpenClaw 实战指南 - 教程为主，技能索引为辅",
    description: "30+ 个真实案例，让 AI 助手真正帮你工作。涵盖 1500+ MCP 技能索引，Claude Code 和 OpenClaw 的权威中文学习资源。",
    images: ["/og-image.png"],
  },
  appLinks: {
    web: {
      url: "https://www.clawtools.dev",
    },
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
  verification: {
    google: "google-site-verification-token", // 替换为实际的验证码
    yandex: "yandex-verification-token",
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
      <head>
        {/* SEO Meta Tags */}
        <meta name="application-name" content="OpenClaw 实战指南" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="OpenClaw Hub" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#000000" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* RSS Feed Auto-discovery */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="OpenClaw Hub - 全部内容"
          href="/rss.xml"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="OpenClaw Hub - 教程"
          href="/rss/tutorials.xml"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="OpenClaw Hub - 技能"
          href="/rss/skills.xml"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="OpenClaw Hub - 配置"
          href="/rss/configs.xml"
        />

        {/* JSON-LD 结构化数据 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "OpenClaw 实战指南",
              "alternateName": "OpenClaw Hub",
              "url": SITE_URL,
              "description": "30+ 个真实案例，让 AI 助手真正帮你工作。涵盖 1500+ MCP 技能索引。",
              "inLanguage": "zh-CN",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": `${SITE_URL}/search?q={search_term_string}`
                },
                "query-input": "required name=search_term_string"
              },
              "publisher": {
                "@type": "Organization",
                "name": "OpenClaw 社区",
                "url": SITE_URL,
                "logo": {
                  "@type": "ImageObject",
                  "url": `${SITE_URL}/logo.png`
                }
              }
            })
          }}
        />

        {/* 组织结构化数据 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "OpenClaw 社区",
              "url": SITE_URL,
              "description": "OpenClaw 是一个强大的 AI 助手框架，让 AI 真正帮你工作",
              "sameAs": [
                "https://github.com/openclaw-tools"
              ],
              "logo": `${SITE_URL}/logo.png`
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
