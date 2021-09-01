import AWS from 'aws-sdk';
import { ContentfulBlogPost } from '../../shared/interface';
import { pipe } from '../../shared/services/utils';

interface ContentfulBlogPostTableItem extends ContentfulBlogPost {
  createdAt?: string;
  updatedAt?: string;
}

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  service: new AWS.DynamoDB({
    region: 'eu-west-1',
  }),
});

const tableName = 'contentful';

const enrichItem = ({
  item,
}: {
  item: ContentfulBlogPostTableItem;
}): ContentfulBlogPostTableItem => {
  item.createdAt = new Date().toISOString();
  item.updatedAt = new Date().toISOString();
  return item;
};

const putItem = async ({ item }: { item: ContentfulBlogPostTableItem }) => {
  await dynamoDb
    .put({
      TableName: tableName,
      Item: item,
    })
    .promise();
};

export const storeItem = (item) => pipe(enrichItem, putItem)(item);
