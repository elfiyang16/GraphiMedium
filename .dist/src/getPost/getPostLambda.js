"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const getPostNew_1 = require("./getPostNew");
// import { MediumController } from './getPost';
const sns = new aws_sdk_1.default.SNS({ apiVersion: '2010-03-31' });
const AWS_REGION = 'eu-west-1';
const getPost = async () => {
    const topicArn = `arn:aws:sns:${AWS_REGION}:${process.env.AWS_ACCOUNT_ID}:${process.env.SNS_SEND_POST_TOPIC_NAME}.fifo`;
    try {
        const mediumController = new getPostNew_1.MediumController();
        const transformedBlogs = await mediumController.extractPosts();
        return await Promise.all(transformedBlogs.map(async (blog) => await sns
            .publish({
            Message: JSON.stringify({
                blog,
            }),
            TopicArn: topicArn,
            // MessageDeduplicationId: 'abc123',
            MessageGroupId: 'medium-post',
        })
            .promise()));
    }
    catch (error) {
        console.error(error);
        return error;
    }
};
const handler = async () => {
    await getPost();
};
exports.handler = handler;
//# sourceMappingURL=getPostLambda.js.map