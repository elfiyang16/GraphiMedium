import { ContentfulController } from './publishPost';
import { ContentfulBlogPost } from './interface';
import { SQSEvent, SQSRecord } from 'aws-lambda';

const parsePostFromRecords = (records: Array<SQSRecord>) =>
  records.map((record) => {
    // The SNS message is the body of the SQS record.
    return JSON.parse(record.body).Message as ContentfulBlogPost;
  });

const publishPost = async (event: SQSEvent) => {
  console.log(JSON.stringify(event, null, 2));

  const transformedBlogs = parsePostFromRecords(event.Records);

  try {
    const contentfulController = new ContentfulController();
    await contentfulController.createBlogEntry(transformedBlogs[0]);
    //TODO: Async Generator
    // transformedBlogs.map(
    //   async (blog) => await contentfulController.createBlogEntry(blog)
    // );
  } catch (error) {
    console.error(error);
    return error;
  }
};

const handler = async (event: SQSEvent) => {
  await publishPost(event);
};

export { handler };
