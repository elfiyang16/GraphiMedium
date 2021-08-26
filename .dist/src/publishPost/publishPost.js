"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentfulController = void 0;
const contentful_management_1 = require("contentful-management");
const utils_1 = require("/opt/nodejs/services/utils");
class ContentfulController {
    constructor(accessToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN) {
        this.CONTENTFUL_ENV = 'master';
        this.CONTENT_TYPE_ID = 'blogPost';
        this.doInit = async () => {
            //TODO: remove client property
            this.client = contentful_management_1.createClient({
                accessToken: this.accessToken,
            });
            try {
                this.environment = await this.client
                    .getSpace(this.getSpaceId())
                    .then((space) => space.getEnvironment(this.CONTENTFUL_ENV))
                    .then((environment) => {
                    return environment;
                });
                // return this.environment;
            }
            catch (err) {
                console.error(err);
            }
        };
        // prevent concurrent calls firing initialization more than once
        this.init = async () => {
            if (!this.initializationPromise) {
                this.initializationPromise = this.doInit();
            }
            return this.initializationPromise;
        };
        this.getSpaceId = () => {
            const spaceId = process.env.CONTENTFUL_SPACE_ID;
            if (!spaceId) {
                throw new Error('Contentful Space Id not found!');
            }
            return spaceId;
        };
        this.createImageAsset = async ({ title, link, }) => {
            await this.init();
            try {
                console.log('Image Processing...');
                console.log('creating image arrayBuffer...');
                const imageArrayBuffer = await utils_1.formatImage(link);
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
            }
            catch (err) {
                console.error(err);
            }
        };
        this.createBlogEntry = async (post) => {
            const { title, slug, heroImage, description, body, publishDate, tags, } = post;
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
            }
            catch (err) {
                console.error(err);
            }
        };
        this.accessToken = accessToken;
        // this.init();
    }
}
exports.ContentfulController = ContentfulController;
//# sourceMappingURL=publishPost.js.map