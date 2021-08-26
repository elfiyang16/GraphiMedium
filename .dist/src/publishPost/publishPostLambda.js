"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const publishPost_1 = require("./publishPost");
const parsePostFromRecords = (records) => records.map((record) => {
    // The SNS message is the body of the SQS record.
    return JSON.parse(record.body).Message;
});
const publishPost = async (event) => {
    console.log(JSON.stringify(event, null, 2));
    const transformedBlogs = parsePostFromRecords(event.Records);
    try {
        const contentfulController = new publishPost_1.ContentfulController();
        await contentfulController.createBlogEntry(transformedBlogs[0]);
        //TODO: Async Generator
        // transformedBlogs.map(
        //   async (blog) => await contentfulController.createBlogEntry(blog)
        // );
    }
    catch (error) {
        console.error(error);
        return error;
    }
};
const handler = async (event) => {
    await publishPost(event);
};
exports.handler = handler;
//# sourceMappingURL=publishPostLambda.js.map