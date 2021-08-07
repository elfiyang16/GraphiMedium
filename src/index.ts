import { MediumController } from './getPost';
import { ContentfulController } from './publishPost';

const doTheWork = async () => {
  try {
    const mediumController = new MediumController();
    const transformedBlogs = await mediumController.extractPosts();
    const contentfulController = new ContentfulController();
    await contentfulController.createBlogEntry(transformedBlogs[0]);
    //TODO: resolve rate limit
    // transformedBlogs.map(
    //   async (blog) => await contentfulController.createBlogEntry(blog)
    // );
  } catch (error) {
    console.error(error);
    return error;
  }
};

(async () => {
  await doTheWork();
})();
