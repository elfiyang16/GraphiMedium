"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLClient = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const graphql_1 = require("graphql");
class GraphQLClient {
    constructor(options) {
        this.options = options;
    }
    async query({ query, variables, }) {
        const response = await node_fetch_1.default(this.options.graphQlUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: this.options.authoriszation,
            },
            body: JSON.stringify({ query: graphql_1.print(query), variables }),
        });
        const body = await response.json();
        return body;
    }
    async mutation({ mutation, variables, }) {
        const response = await node_fetch_1.default(this.options.graphQlUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: "sss",
            },
            body: JSON.stringify({ mutation: graphql_1.print(mutation), variables }),
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const body = await response.json();
        return body;
    }
}
exports.GraphQLClient = GraphQLClient;
//# sourceMappingURL=graphql-client.js.map