"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getPostNew_1 = require("./getPost/getPostNew");
const publishPost_1 = require("./publishPost/publishPost");
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
(async () => {
    await doTheWork();
})();
//# sourceMappingURL=indexee.js.map