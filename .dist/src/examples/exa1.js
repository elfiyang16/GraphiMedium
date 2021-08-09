"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const graphql_query = `
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
`;
const page_limit = 25;
async function get_medium_post(username, page) {
    let graphql_body = {
        operationName: 'UserStreamOverview',
        query: graphql_query,
        variables: {
            userId: username,
            pagingOptions: {
                limit: page_limit,
                page: null,
                source: null,
                to: page ? String(page) : String(Date.now()),
                ignoredIds: null,
            },
        },
    };
    // NOTE: sending request to rss2json to help us transofrm rss to json data
    let resp = await node_fetch_1.default('https://medium.com/_/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(graphql_body),
    });
    // NOTE: strip non-post items and strip description fields
    let resp_data = await resp.json();
    console.log('RES\n', resp_data);
    //   let author = resp_data.data.user.name;
    //   let posts = resp_data.data.user.profileStreamConnection.stream
    //     .map((stream) => {
    //       return stream.itemType.post;
    //     })
    //     .map((post) => {
    //       return {
    //         title: post.title,
    //         link: post.mediumUrl,
    //         pubDate: post.firstPublishedAt,
    //         thumbnail:
    //           'https://miro.medium.com/focal/875/263/11/60/' + post.previewImage.id,
    //         categories: post.tags.map((tag_obj) => tag_obj.id),
    //       };
    //     });
    //   if (posts.length === page_limit) {
    //     next = resp_data.data.user.profileStreamConnection.pagingInfo.next.to;
    //   } else {
    //     next = null;
    //   }
    //   return {
    //     author: author,
    //     posts: posts,
    //     next: next,
    //   };
}
(async () => {
    await get_medium_post('elfi-y', 1);
})();
//# sourceMappingURL=exa1.js.map