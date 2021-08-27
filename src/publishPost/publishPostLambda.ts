import { ContentfulController } from './publishPost';
import { ContentfulBlogPost } from '/opt/nodejs/interface';
import { SQSEvent, SQSRecord } from 'aws-lambda';

const parsePostFromRecords = (records: Array<SQSRecord>) =>
  records.map((record) => {
    // The SNS message is the body of the SQS record.
    return JSON.parse(JSON.parse(record.body).Message)
      .blog as ContentfulBlogPost;
  });

const publishPost = async (event: SQSEvent) => {
  // console.log(JSON.stringify(event, null, 2));

  const transformedBlogs = parsePostFromRecords(event.Records);

  try {
    const contentfulController = new ContentfulController();
    //For now just one blog per record so will always be position at [0]
    await contentfulController.createBlogEntry(transformedBlogs[0]);
  } catch (error) {
    console.error(error);
    return error;
  }
};

const handler = async (event: SQSEvent) => {
  await publishPost(event);
};

export { handler };
