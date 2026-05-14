import blurData from "../../data/blur-data-urls.json";
import type { Photo } from "@/lib/types";

const kansaiFiles = [
  "DSC_1507.webp",
  "DSC_1512.webp",
  "DSC_1525.webp",
  "DSC_1531.webp",
  "DSC_1547.webp",
  "DSC_1560.webp",
  "DSC_1592.webp",
  "DSC_1599.webp",
  "DSC_1610.webp",
  "DSC_1615.webp",
  "DSC_1629.webp",
  "DSC_1631.webp",
  "DSC_1640.webp",
  "DSC_1644.webp",
  "DSC_1651.webp",
  "DSC_1657.webp",
  "DSC_1671.webp",
  "DSC_1681.webp",
  "DSC_1685.webp",
  "DSC_1700.webp",
  "DSC_1702.webp",
  "DSC_1706.webp",
  "DSC_1707.webp",
  "DSC_1803.webp",
  "DSC_1858.webp",
  "DSC_1903.webp",
  "DSC_1927.webp",
  "DSC_1933.webp",
  "DSC_1956.webp",
  "DSC_1960.webp",
  "DSC_1974.webp",
  "DSC_2000.webp",
  "DSC_2012.webp",
  "DSC_2025.webp",
  "DSC_2042.webp",
  "DSC_2045.webp",
] as const;

type BlurData = {
  kansai?: Record<string, string | undefined>;
};

const blurs = blurData as BlurData;

export const staticPhotos: Photo[] = kansaiFiles.map((file, index) => {
  const title = file.replace(/\.webp$/, "");

  return {
    id: String(index + 1),
    src: `/photos/kansai/optimized/${file}`,
    thumbnail: `/photos/kansai/thumbnails/${file}`,
    title,
    location: "Kansai",
    category: "kansai",
    width: 1600,
    height: 1067,
    blurDataURL: blurs.kansai?.[file],
  };
});

export function getStaticPhotos(category?: string | null): Photo[] {
  if (!category) {
    return staticPhotos;
  }

  return staticPhotos.filter((photo) => photo.category === category);
}
