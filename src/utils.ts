import { MediumPost, ContentfulBlogPost } from './interface';
import TurndownService from 'turndown';
import { richTextFromMarkdown } from '@contentful/rich-text-from-markdown';

// const sharp = require('sharp');

const convertHtmlToMarkdown = (content: string) => {
  const turndownService = new TurndownService();
  turndownService.remove('img').remove('figcaption');
  const markdown = turndownService.turndown(content);
  console.log('MARKETDOWN', markdown);
  return markdown as string;
};

const convertMarkdownToRichtext = async (content: string) => {
  const document = await richTextFromMarkdown(content);
  console.log('DOCUMENT', document);
  return document;
};

const getSlugFromTitle = (title: string): string => {
  //replace all special characters | symbols with a space
  title = title
    .replace(/[`~!@#$%^&*()_\-+=\[\]{};:'"\\|\/,.<>?\s]/g, ' ')
    .toLowerCase();
  // trim spaces at start and end of string
  title = title.replace(/^\s+|\s+$/gm, '');
  // replace space with dash/hyphen
  title = title.replace(/\s+/g, '-');
  //return str;
  return title;
};

// const imgToDataURL = async (url) => {
//   return await fetch(url, {
//     method: 'GET',
//   }).then(({ data }) => {
//     return sharp(data).resize(198, 110).png().toBuffer();
//   });
// };

export const extractPost = async (
  post: MediumPost
): Promise<ContentfulBlogPost> => {
  const body = await convertMarkdownToRichtext(
    convertHtmlToMarkdown(post.description)
  );
  return {
    title: post.title,
    slug: getSlugFromTitle(post.title),
    heroImage: post.thumbnail, //type:Link, linkType:Asset
    description: `Originally published at [Medium](${post.link})`,
    body: body,
    publishDate: new Date(Date.parse(post.pubDate)), //1626901065000, type:Date
    tags: post.categories,
  };
};
