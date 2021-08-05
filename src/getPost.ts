import fetch from 'node-fetch';
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const BASE_URL =
  'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@';
const MEDIUM_URL = BASE_URL + process.env.MEDIUM_USERNAME;

interface Post {
  title: string;
  pubDate: string; // "2021-07-21 20:57:45"
  link: string;
  guid: string;
  author: 'E.Y';
  thumbnail: string;
  description: string; //html
  enclosure?: any;
  categories?: string[];
}

const extractPost = (post: Post) => {
  return {
    title: post.title,
    publishDate: post.pubDate,
    link: post.link,
    tags: post.categories,
  };
};

const extractImg = (post: Post) => {
  return {
    title: post.title,
    publishDate: post.pubDate,
    link: post.link,
    tags: post.categories,
  };
};

const getUserData = async () => {
  try {
    const response = await fetch(MEDIUM_URL, {
      method: 'GET',
    });

    const statusCode = await response.status;
    const result = await response.json();
    // fs.writeFile('/example.html', result.items[0].description, (error) => {
    //   /* handle error */
    // });
    fs.writeFileSync(
      path.join(__dirname, 'example.html'),
      result.items[0].description
    );

    console.log('RESULT', statusCode);
    console.log('RESULT', result.items.length);
  } catch (error) {
    console.error(error);
    return error;
  }
};

(async () => {
  await getUserData();
})();
