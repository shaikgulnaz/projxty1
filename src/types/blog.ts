export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  category: string;
  tags: string[];
  author: string;
  publishDate: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  readTime: number;
  views: number;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  postCount: number;
}