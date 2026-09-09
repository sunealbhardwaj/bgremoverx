export type BlogCategory =
  | 'Background Removal'
  | 'AI Image Editing'
  | 'Photo Editing'
  | 'Product Photography'
  | 'Transparent PNG'
  | 'Image Tips'
  | 'Design Tips';

export interface BlogTable {
  headers: string[];
  rows: string[][];
  caption?: string;
}

export interface BlogFaq {
  question: string;
  answer: string;
}

export interface BlogSection {
  id: string;
  heading: string;
  subheading?: string;
  paragraphs: string[];
  bulletPoints?: string[];
  numberedSteps?: { title: string; text: string }[];
  callout?: {
    type: 'tip' | 'note' | 'warning' | 'info';
    title?: string;
    text: string;
  };
  table?: BlogTable;
  subsections?: {
    heading: string;
    paragraphs: string[];
    bulletPoints?: string[];
  }[];
}

export interface BlogAuthor {
  name: string;
  role: string;
  bio: string;
  avatarUrl: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  category: BlogCategory;
  readTime: string;
  publishedDate: string;
  modifiedDate: string;
  coverImage: string;
  coverImageAlt: string;
  excerpt: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  author: BlogAuthor;
  tableOfContents: { id: string; title: string }[];
  introParagraphs: string[];
  sections: BlogSection[];
  commonMistakes?: { mistake: string; solution: string }[];
  conclusionParagraphs: string[];
  faqs: BlogFaq[];
  relatedSlugs: string[];
}
