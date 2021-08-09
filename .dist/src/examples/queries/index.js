"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET_USER_POSTS = void 0;
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.GET_USER_POSTS = graphql_tag_1.default(`
query UserStreamOverview($userId: ID!, $pagingOptions: PagingOptions) {
  user(username: $userId) {
    name
    profileStreamConnection(paging: $pagingOptions) {
      ...commonStreamConnection
      __typename
    }
    __typename
  }
}
fragment commonStreamConnection on StreamConnection {
  pagingInfo {
    next {
      limit
      page
      source
      to
      ignoredIds
      __typename
    }
    __typename
  }
  stream {
    ...StreamItemList_streamItem
    __typename
  }
  __typename
}
fragment StreamItemList_streamItem on StreamItem {
  ...StreamItem_streamItem
  __typename
}
fragment StreamItem_streamItem on StreamItem {
  itemType {
    __typename
    ... on StreamItemPostPreview {
        post {
            id
            mediumUrl
            title
            firstPublishedAt
            creator {
                name
            }
            previewImage {
                id
            }
            tags {
                id
            }
            __typename
        }
      __typename
    }
  }
  __typename
}
`);
//# sourceMappingURL=index.js.map