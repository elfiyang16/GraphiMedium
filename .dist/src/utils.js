"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformPost = exports.formatImage = void 0;
const turndown_1 = __importDefault(require("turndown"));
const rich_text_from_markdown_1 = require("@contentful/rich-text-from-markdown");
const node_fetch_1 = __importDefault(require("node-fetch"));
const sharp_1 = __importDefault(require("sharp"));
const convertHtmlToMarkdown = (content) => {
    const turndownService = new turndown_1.default();
    turndownService.remove('img').remove('figcaption');
    const markdown = turndownService.turndown(content);
    console.log('MARKETDOWN', markdown);
    return markdown;
};
const convertMarkdownToRichtext = async (content) => {
    const document = await rich_text_from_markdown_1.richTextFromMarkdown(content);
    console.log('DOCUMENT', document);
    return document;
};
const getSlugFromTitle = (title) => {
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
const getBufferFromUrl = async (url) => {
    try {
        const response = await node_fetch_1.default(url);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        return buffer;
    }
    catch (err) {
        console.error(err);
    }
};
const convertBufferToArrayBuffer = (buffer) => {
    // https://gist.github.com/miguelmota/5b06ae5698877322d0ca
    //  var ab = new ArrayBuffer(buffer.length);
    //  var view = new Uint8Array(ab);
    //  for (var i = 0; i < buffer.length; ++i) {
    //    view[i] = buffer[i];
    //  }
    //  return ab;
    return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
};
const formatImage = async (url) => {
    const imageBuffer = await getBufferFromUrl(url);
    console.log('IMAGEBuffer', imageBuffer);
    const buffer = await sharp_1.default(imageBuffer)
        .raw()
        .resize({ width: 700, height: 393, fit: sharp_1.default.fit.cover })
        .jpeg()
        .toBuffer({ resolveWithObject: false });
    console.log('BUFFER', buffer);
    const arrayBuffer = convertBufferToArrayBuffer(buffer);
    console.log('ARRAYBUFFER', arrayBuffer);
    return arrayBuffer;
};
exports.formatImage = formatImage;
const transformPost = async (post) => {
    const body = await convertMarkdownToRichtext(convertHtmlToMarkdown(post.description));
    console.log('IN BETWEEN TRANSFORMPOST', body);
    return {
        title: post.title,
        slug: getSlugFromTitle(post.title),
        heroImage: post.thumbnail,
        description: `Originally published at [Medium](${post.link})`,
        body: body,
        publishDate: new Date(Date.parse(post.pubDate)),
        tags: post.categories,
    };
};
exports.transformPost = transformPost;
//# sourceMappingURL=utils.js.map