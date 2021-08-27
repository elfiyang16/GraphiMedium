"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const publishPost_1 = require("./publishPost");
const parsePostFromRecords = (records) => records.map((record) => {
    // The SNS message is the body of the SQS record.
    return JSON.parse(JSON.parse(record.body).Message)
        .blog;
});
const publishPost = async (event) => {
    // console.log(JSON.stringify(event, null, 2));
    const transformedBlogs = parsePostFromRecords(event.Records);
    try {
        const contentfulController = new publishPost_1.ContentfulController();
        //For now just one blog per record so will always be position at [0]
        await contentfulController.createBlogEntry(transformedBlogs[0]);
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