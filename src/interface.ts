import { Asset } from 'contentful-management/dist/typings/entities/asset';

export interface MediumPost {
  title: string;
  pubDate: string; // "2021-07-21 20:57:45"
  link: string;
  guid?: string;
  author?: 'E.Y';
  thumbnail: string;
  description: string; //html
  enclosure?: any;
  categories?: string[];
}

export interface ContentfulBlogPost {
  title: string;
  slug: string;
  // heroImage?: Asset;
  heroImage?: any;
  description?: string;
  body: string;
  publishDate: Date; // "2021-07-21 20:57:45"
  tags?: string[];
}
