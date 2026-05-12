// 添加新系列：在数组中加一项，然后在 CATEGORY_LABELS 中补充对应标签即可
export const CATEGORIES = ['kansai'] as const;
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  kansai: '日本关西',
};

export interface Photo {
  id: string;
  src: string;
  thumbnail: string;
  title: string;
  location: string;
  category: Category;
  width: number;
  height: number;
}

export interface ProjectMeta {
  slug: Category;
  title: string;
  cover: string;
  description: string;
  year: string;
  photoCount: number;
}
