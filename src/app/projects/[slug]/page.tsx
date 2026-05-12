import type { Metadata } from "next";
import ProjectClient from "@/components/ProjectClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { CATEGORY_LABELS } = await import("@/lib/types");
  const title = CATEGORY_LABELS[slug as keyof typeof CATEGORY_LABELS] ?? slug;
  return {
    title,
    description: `${title} — 摄影作品系列`,
    openGraph: {
      title: `${title} · LENS`,
      description: `${title} — 摄影作品系列`,
      type: "website",
      locale: "zh_CN",
    },
  };
}

export default function ProjectPage() {
  return <ProjectClient />;
}
