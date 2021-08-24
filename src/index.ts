import { MediumController } from './getPostNew';
// import { MediumController } from './getPost';

import { ContentfulController } from './publishPost';
// import AWS from 'aws-sdk';

const doTheWork = async () => {
  try {
    const mediumController = new MediumController();
    const transformedBlogs = await mediumController.extractPosts();
    const contentfulController = new ContentfulController();
    await contentfulController.createBlogEntry(transformedBlogs[0]);
    // TODO: resolve rate limit
    // transformedBlogs.map(
    //   async (blog) => await contentfulController.createBlogEntry(blog)
    // );
  } catch (error) {
    console.error(error);
    return error;
  }
};
// exports.handler = async () => {
//   await doTheWork();
// };
const handler = async () => {
  await doTheWork();
};

export { handler };
