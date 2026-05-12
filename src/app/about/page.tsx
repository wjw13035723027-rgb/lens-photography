import type { Metadata } from "next";
import AboutClient from "@/components/AboutClient";

export const metadata: Metadata = {
  title: "关于",
  description: "热爱光影，痴迷于捕捉那些转瞬即逝的瞬间。擅长风光与街拍，喜欢用镜头讲述城市与自然的故事。",
  openGraph: {
    title: "关于 · LENS",
    description: "热爱光影，痴迷于捕捉那些转瞬即逝的瞬间。",
    type: "website",
    locale: "zh_CN",
  },
};

export default function About() {
  return <AboutClient />;
}
