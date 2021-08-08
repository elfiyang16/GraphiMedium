"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getPostNew_1 = require("./getPostNew");
// import { MediumController } from './getPost';
const publishPost_1 = require("./publishPost");
// import AWS from 'aws-sdk';
const doTheWork = async () => {
    try {
        const mediumController = new getPostNew_1.MediumController();
        const transformedBlogs = await mediumController.extractPosts();
        const contentfulController = new publishPost_1.ContentfulController();
        await contentfulController.createBlogEntry(transformedBlogs[0]);
        //TODO: resolve rate limit
        // transformedBlogs.map(
        //   async (blog) => await contentfulController.createBlogEntry(blog)
        // );
    }
    catch (error) {
        console.error(error);
        return error;
    }
};
exports.handler = async () => {
    await doTheWork();
};
//# sourceMappingURL=index.js.map