export type NewsCategoryColor = 'primary' | 'accent-orange' | 'pink-500' | 'green-600' | 'purple-600' | 'teal-600';

export interface NewsArticle {
  id: number;
  title: string;
  category: string;
  categoryColor: NewsCategoryColor;
  icon: string;
  date: string;
  author: string;
  excerpt: string;
  image: string;
  alt: string;
}

export interface NewsCategory {
  name: string;
  icon: string;
  value: string;
}

export interface HighlightNews {
  title: string;
  category: string;
  image: string;
  alt: string;
}