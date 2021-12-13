import { MediumController } from './getPost/getPostNew';
import { ContentfulController } from './publishPost/publishPost';

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
