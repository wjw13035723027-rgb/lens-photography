import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageWrapper from "@/components/PageWrapper";
import { AuthProvider } from "@/lib/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://lens-photography.vercel.app"),
  title: {
    default: "LENS · 摄影作品集",
    template: "%s · LENS",
  },
  description: "个人摄影作品展示 — 镜头之下，光影之间",
  robots: { index: true, follow: true },
  openGraph: {
    title: "LENS · 摄影作品集",
    description: "个人摄影作品展示 — 镜头之下，光影之间",
    type: "website",
    locale: "zh_CN",
    siteName: "LENS",
  },
  twitter: {
    card: "summary_large_image",
    title: "LENS · 摄影作品集",
    description: "个人摄影作品展示 — 镜头之下，光影之间",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('lens-theme');if(t==='light'||(!t&&window.matchMedia('(prefers-color-scheme:light)').matches)){document.documentElement.setAttribute('data-theme','light')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <AuthProvider>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[999] focus:px-4 focus:py-2 focus:bg-foreground focus:text-background focus:rounded focus:text-sm focus:tracking-widest"
            >
              跳转到内容
            </a>
            <Navbar />
            <main id="main-content" className="flex-1">
              <PageWrapper>{children}</PageWrapper>
            </main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
