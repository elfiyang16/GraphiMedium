"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const getPostNew_1 = require("./getPost/getPostNew");
// import { MediumController } from './getPost';
const publishPost_1 = require("./publishPost/publishPost");
// import AWS from 'aws-sdk';
const doTheWork = async () => {
    try {
        const mediumController = new getPostNew_1.MediumController();
        const transformedBlogs = await mediumController.extractPosts();
        const contentfulController = new publishPost_1.ContentfulController();
        await contentfulController.createBlogEntry(transformedBlogs[0]);
        // TODO: resolve rate limit
        // transformedBlogs.map(
        //   async (blog) => await contentfulController.createBlogEntry(blog)
        // );
    }
    catch (error) {
        console.error(error);
        return error;
    }
};
// exports.handler = async () => {
//   await doTheWork();
// };
const handler = async () => {
    await doTheWork();
};
exports.handler = handler;
//# sourceMappingURL=index.js.map