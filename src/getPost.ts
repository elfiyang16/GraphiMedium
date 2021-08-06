import fetch from 'node-fetch';
const fs = require('fs');
const path = require('path');
require('dotenv').config();
import { transformPost } from './utils';
import { ContentfulController } from './publishPost';
import { MediumPost, ContentfulBlogPost } from './interface';

const BASE_URL =
  'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@';

export class MediumController {
  private initializationPromise: Promise<void>;
  private result: any;
  public constructor() {}

  private readonly MEDIUM_URL = BASE_URL + process.env.MEDIUM_USERNAME;

  private doInit = async () => {
    try {
      const response = await fetch(this.MEDIUM_URL, {
        method: 'GET',
      });
      const statusCode = await response.status;
      if (statusCode === 200 || statusCode === 201) {
        this.result = await response.json();
      } else {
        throw new Error('Problem with retrieving medium data!');
      }
      // fs.writeFile('/example.html', result.items[0].description, (error) => {
      //   /* handle error */
      // });
      // fs.writeFileSync(
      //   path.join(__dirname, 'example.html'),
      //   result.items[0].description
      // );
    } catch (err) {
      console.error(err);
    }
  };

  private init = async () => {
    if (!this.initializationPromise) {
      this.initializationPromise = this.doInit();
    }
    return this.initializationPromise;
  };

  private getPostsFromLastWeek = async (): Promise<MediumPost[]> => {
    await this.init();

    if (this.result.items.length > 0) {
      return this.result.items.filter((blog: MediumPost) => {
        // filter out blogs posted more than a week ago
        new Date(blog.pubDate) >= this.getLastWeek();
      });
    }
    return [];
  };

  private getLastWeek = () => {
    const today = new Date();
    const lastWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 7
    );
    return lastWeek;
  };

  public extractPosts = async (): Promise<ContentfulBlogPost[]> => {
    await this.init();
    const blogs = await this.getPostsFromLastWeek();
    if (blogs.length === 0) {
      // TODO: TERMINATING the service, no blog to transform
      //// process.exit();
      return [];
    }
    const transformedBlogs = await Promise.all(
      blogs.map(async (blog) => await transformPost(blog))
    );

    return transformedBlogs;
  };

  // TODO: PREVENT MULTIPLE INVOKE, IF NOT CREATING/TIMEOUT, THEN
}

const doTheWork = async () => {
  try {
    const mediumController = new MediumController();
    const transformedBlogs = await mediumController.extractPosts();
    const contentfulController = new ContentfulController();
    //TODO: resolve rate limit
    // transformedBlogs.map(
    //   async (blog) => await contentfulController.createBlogEntry(blog)
    // );
  } catch (error) {
    console.error(error);
    return error;
  }
};

(async () => {
  await doTheWork();
})();
