import AWS from 'aws-sdk';
import { MediumController } from './getPostNew';
// import { MediumController } from './getPost';

const sns = new AWS.SNS({ apiVersion: '2010-03-31' });
const AWS_REGION = 'eu-west-1';

const getPost = async () => {
  const topicArn = `arn:aws:sns:${AWS_REGION}:${process.env.AWS_ACCOUNT_ID}:${process.env.SNS_SEND_POST_TOPIC_NAME}.fifo`;
  try {
    const mediumController = new MediumController();
    const transformedBlogs = await mediumController.extractPosts();
    console.log('TransformBlogs', transformedBlogs);
    transformedBlogs.map(async (blog) => {
      const result = await sns
        .publish({
          Message: JSON.stringify({
            blog,
          }),
          TopicArn: topicArn,
          MessageGroupId: 'medium-post',
          // MessageDeduplicationId: 'abc123',
        })
        .promise();
      console.log('SNS RESULT\n', result);
    });
  } catch (error) {
    console.error(error);
    return error;
  }
};

const handler = async () => {
  await getPost();
};

export { handler };
