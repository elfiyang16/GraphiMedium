import { ContentfulBlogPost } from '/opt/nodejs/interface';
import { storeItem } from './storePost';
import { SQSEvent, SQSRecord } from 'aws-lambda';

const parsePostFromRecords = (records: Array<SQSRecord>) =>
  records.map((record) => {
    return JSON.parse(JSON.parse(record.body).Message)
      .blog as ContentfulBlogPost;
  });

const storePost = async (event: SQSEvent) => {
  // console.log(JSON.stringify(event, null, 2));
  const transformedBlogs = parsePostFromRecords(event.Records);

  try {
    await storeItem(transformedBlogs[0]);
  } catch (error) {
    console.error(error);
    return error;
  }
};

const handler = async (event: SQSEvent) => {
  await storePost(event);
};

export { handler };
