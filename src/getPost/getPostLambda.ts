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

    return await Promise.all(
      transformedBlogs.map(
        async (blog) =>
          await sns
            .publish({
              Message: JSON.stringify({
                blog,
              }),
              TopicArn: topicArn,
              // MessageDeduplicationId: 'abc123',
              MessageGroupId: 'medium-post',
            })
            .promise()
      )
    );
  } catch (error) {
    console.error(error);
    return error;
  }
};

const handler = async () => {
  await getPost();
};

export { handler };
