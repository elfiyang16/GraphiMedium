import { createClient } from 'contentful-management';
import { ClientAPI } from 'contentful-management/dist/typings/create-contentful-api';
import { Environment } from 'contentful-management/dist/typings/entities/environment';
import { ContentfulBlogPost } from '/opt/nodejs/interface';
import { formatImage } from '/opt/nodejs/services/utils';
export class ContentfulController {
  accessToken: string;
  client: ClientAPI;
  environment: Environment;
  initializationPromise: Promise<void>;

  public constructor(accessToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN!) {
    this.accessToken = accessToken;
    // this.init();
  }

  private readonly CONTENTFUL_ENV = 'master';
  private readonly CONTENT_TYPE_ID = 'blogPost';

  private doInit = async () => {
    //TODO: remove client property
    this.client = createClient({
      accessToken: this.accessToken,
    });

    try {
      this.environment = await this.client
        .getSpace(this.getSpaceId())
        .then((space) => space.getEnvironment(this.CONTENTFUL_ENV))
        .then((environment) => {
          return environment as Environment;
        });
      // return this.environment;
    } catch (err) {
      console.error(err);
    }
  };
  // prevent concurrent calls firing initialization more than once
  private init = async () => {
    if (!this.initializationPromise) {
      this.initializationPromise = this.doInit();
    }
    return this.initializationPromise;
  };

  private getSpaceId = (): string => {
    const spaceId = process.env.CONTENTFUL_SPACE_ID;
    if (!spaceId) {
      throw new Error('Contentful Space Id not found!');
    }
    return spaceId;
  };

  private createImageAsset = async ({
    title,
    link,
  }: {
    title: string;
    link: string;
  }) => {
    await this.init();
    try {
      console.log('Image Processing...');
      console.log('creating image arrayBuffer...');

      const imageArrayBuffer = await formatImage(link);
      console.log('uploading asset...');
      const imageUpload = await this.environment.createUpload({
        file: imageArrayBuffer,
      });
      console.log('creating asset...');
      const imageAsset = await this.environment
        .createAsset({
          fields: {
            title: {
              'en-US': title,
            },
            file: {
              'en-US': {
                fileName: `${title}.jpeg`,
                contentType: 'image/jpeg',
                // upload: link,
                uploadFrom: {
                  sys: {
                    type: 'Link',
                    linkType: 'Upload',
                    id: imageUpload.sys.id,
                  },
                },
              },
            },
          },
        })
        .then((asset) => {
          console.log('prcessing...');
          return asset.processForLocale('en-US', { processingCheckWait: 2000 });
        })
        .then((asset) => {
          console.log('publishing...');
          return asset.publish();
        })
        .then((asset) => {
          return asset;
        });

      return imageAsset;
    } catch (err) {
      console.error(err);
    }
  };

  public createBlogEntry = async (post: ContentfulBlogPost) => {
    const {
      title,
      slug,
      heroImage,
      description,
      body,
      publishDate,
      tags,
    } = post;
    await this.init();
    console.log('CREATE ENTRY', title);

    const imageAsset = await this.createImageAsset({
      title,
      link: heroImage,
    });
    if (!imageAsset) {
      throw Error(`Cannot get image asset for ${title}`);
    }
    console.log('IMAGE CREATED', imageAsset);

    try {
      const entry = await this.environment
        .createEntry(this.CONTENT_TYPE_ID, {
          fields: {
            title: {
              'en-US': title,
            },
            slug: {
              'en-US': slug,
            },
            heroImage: {
              'en-US': {
                sys: {
                  id: imageAsset.sys['id'],
                  linkType: 'Asset',
                  type: 'Link',
                },
              },
            },
            description: {
              'en-US': description,
            },
            body: {
              'en-US': body,
            },
            publishDate: {
              'en-US': publishDate,
            },
            tags: {
              'en-US': tags,
            },
          },
        })
        .then((entry) => entry.publish())
        .then((entry) => entry);
      console.log('ENTRY', entry);

      return entry;
    } catch (err) {
      console.error(err);
    }
  };
}
