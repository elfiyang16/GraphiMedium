"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediumController = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const utils_1 = require("/opt/nodejs/services/utils");
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const BASE_URL = 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@';
class MediumController {
    constructor() {
        this.MEDIUM_URL = BASE_URL + process.env.MEDIUM_USERNAME;
        this.doInit = async () => {
            try {
                const response = await node_fetch_1.default(this.MEDIUM_URL, {
                    method: 'GET',
                });
                const statusCode = await response.status;
                if (statusCode === 200 || statusCode === 201) {
                    this.result = await response.json();
                }
                else {
                    throw new Error('Problem with retrieving medium data!');
                }
                // fs.writeFile('/example.html', result.items[0].description, (error) => {
                //   /* handle error */
                // });
                // fs.writeFileSync(
                //   path.join(__dirname, 'example.html'),
                //   result.items[0].description
                // );
            }
            catch (err) {
                console.error(err);
            }
        };
        this.init = async () => {
            if (!this.initializationPromise) {
                this.initializationPromise = this.doInit();
            }
            return this.initializationPromise;
        };
        this.getPostsFromLastWeek = async () => {
            await this.init();
            if (this.result.items.length > 0) {
                return this.result.items.filter((blog) => {
                    // filter out blogs posted more than a week ago
                    new Date(blog.pubDate) >= this.getLastWeek();
                });
            }
            return [];
        };
        this.getLastWeek = () => {
            const today = new Date();
            const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
            return lastWeek;
        };
        this.extractPosts = async () => {
            await this.init();
            // const blogs = await this.getPostsFromLastWeek();
            // if (blogs.length === 0) {
            //   // TODO: TERMINATING the service, no blog to transform
            //   //// process.exit();
            //   return [];
            // }
            // const transformedBlogs = await Promise.all(
            //   blogs.map(async (blog) => await transformPost(blog))
            // );
            const transformedBlogs = (await Promise.all(this.result.items.map(async (blog) => await utils_1.transformPost(blog))));
            return transformedBlogs;
        };
    }
}
exports.MediumController = MediumController;
//# sourceMappingURL=getPostNew.js.map