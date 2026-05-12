import type { Metadata } from "next";
import ContactClient from "@/components/ContactClient";

export const metadata: Metadata = {
  title: "联系",
  description: "合作、约拍、或其他事宜，欢迎来信。",
  openGraph: {
    title: "联系 · LENS",
    description: "合作、约拍、或其他事宜，欢迎来信。",
    type: "website",
    locale: "zh_CN",
  },
};

export default function Contact() {
  return <ContactClient />;
}
