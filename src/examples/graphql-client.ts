import fetch from "node-fetch";
import { GraphQLError, DocumentNode, print } from "graphql";

type Options = {
  graphQlUrl: string;
  authoriszation: string;
};

type OperationVariables =
  | string
  | number
  | boolean
  | Date
  | null
  | undefined
  | { [property: string]: OperationVariables }
  | Array<OperationVariables>;

type QueryResult<TData> = {
  data: TData;
  errors?: ReadonlyArray<GraphQLError>;
};

type MutationResult<TData> = {
  data: TData;
  errors?: ReadonlyArray<GraphQLError>;
};

export class GraphQLClient {
  options: Options;

  constructor(options: Options) {
    this.options = options;
  }

  async query<TData = unknown, TVariables = OperationVariables>({
    query,
    variables,
  }: {
    query: DocumentNode;
    variables: TVariables;
  }): Promise<QueryResult<TData>> {
    const response = await fetch(this.options.graphQlUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: this.options.authoriszation,
      },
      body: JSON.stringify({ query: print(query), variables }),
    });

    const body = await response.json();

    return body;
  }

  async mutation<TData = unknown, TVariables = OperationVariables>({
    mutation,
    variables,
  }: {
    mutation: DocumentNode;
    variables: TVariables;
  }): Promise<MutationResult<TData>> {
    const response = await fetch(this.options.graphQlUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "sss",
      },
      body: JSON.stringify({ mutation: print(mutation), variables }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const body = await response.json();

    return body;
  }
}
