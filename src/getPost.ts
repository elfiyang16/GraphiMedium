import fetch from 'node-fetch';
const fs = require('fs');
const path = require('path');
require('dotenv').config();
import { extractPost } from './utils';
import { ContentfulController } from './publishPost';

const BASE_URL =
  'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@';
const MEDIUM_URL = BASE_URL + process.env.MEDIUM_USERNAME;

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
    // fs.writeFileSync(
    //   path.join(__dirname, 'example.html'),
    //   result.items[0].description
    // );

    console.log('RESULT', statusCode);
    console.log('RESULT', result.items.length);
    const blog = await extractPost(result.items[0]);
    console.log('BLOG', blog);

    const contentfulController = new ContentfulController();
    contentfulController.createBlogEntry(blog);
  } catch (error) {
    console.error(error);
    return error;
  }
};

(async () => {
  await getUserData();
})();
