import type { Metadata } from "next";
import HomeClient from "@/components/HomeClient";

export const metadata: Metadata = {
  title: "作品系列",
  description: "个人摄影作品系列 — 镜头之下，光影之间。按系列探索风光、街拍、旅行摄影精选。",
  openGraph: {
    title: "LENS · 摄影作品集",
    description: "镜头之下，光影之间 — 按系列探索摄影作品。",
    type: "website",
    locale: "zh_CN",
  },
};

export default function Home() {
  return <HomeClient />;
}
