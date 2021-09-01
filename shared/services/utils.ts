import { MediumPost, ContentfulBlogPost } from '../interface';
import TurndownService from 'turndown';
import { richTextFromMarkdown } from '@contentful/rich-text-from-markdown';
import fetch from 'node-fetch';
import sharp from 'sharp';

const convertHtmlToMarkdown = (content: string) => {
  const turndownService = new TurndownService();
  turndownService.remove('img').remove('figcaption');
  const markdown = turndownService.turndown(content);
  console.log('MARKETDOWN', markdown);
  return markdown as string;
};

const convertMarkdownToRichtext = async (content: string) => {
  const document = await richTextFromMarkdown(content);
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

const getBufferFromUrl = async (url: string): Promise<Buffer | undefined> => {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return buffer;
  } catch (err) {
    console.error(err);
  }
};

const convertBufferToArrayBuffer = (buffer: Buffer): ArrayBuffer => {
  // https://gist.github.com/miguelmota/5b06ae5698877322d0ca
  //  var ab = new ArrayBuffer(buffer.length);
  //  var view = new Uint8Array(ab);
  //  for (var i = 0; i < buffer.length; ++i) {
  //    view[i] = buffer[i];
  //  }
  //  return ab;
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  );
};

export const formatImage = async (url: string) => {
  const imageBuffer = await getBufferFromUrl(url);
  console.log('IMAGEBuffer', imageBuffer);

  const buffer = await sharp(imageBuffer)
    .raw()
    .resize({ width: 700, height: 393, fit: sharp.fit.cover })
    .jpeg()
    .toBuffer({ resolveWithObject: false });
  console.log('BUFFER', buffer);

  const arrayBuffer = convertBufferToArrayBuffer(buffer);
  console.log('ARRAYBUFFER', arrayBuffer);

  return arrayBuffer;
};

export const transformPost = async (
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

export const pipe = (...functions) => (x) =>
  functions.reduce((acc, fn) => fn(acc), x);
