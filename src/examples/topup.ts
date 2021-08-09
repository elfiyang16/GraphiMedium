import gql from 'graphql-tag';
import { GraphQLClient } from './graphql-client';

type Organisation = {
  id: string;
  members: {
    results: {
      id: string;
      accessibleBudgets: Array<{
        id: string;
      }>;
    };
  };
};

const organisationUsersQuery = gql`
  query {
    organisation(id: "2c601bf8-6afb-4177-99b7-f7c366887a2f") {
      members(size: 2000) {
        results {
          ... on User {
            id
            accessibleBudgets {
              id
            }
          }
        }
      }
    }
  }
`;

const run = async (): Promise<void> => {
  const client = new GraphQLClient({
    graphQlUrl: 'https://api.app.learnerbly.com/',
    authoriszation:
      'eyJraWQiOiJJSEdlZzFjdksxTDJDVDhoMEZjS2JaQnc5YzNDODV5MUM3emJLK0dWc1VzPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI0ZmQxYzk0ZS02NWJmLTRkYjctOTA3My1mYWE0ZjlmNDdiNDMiLCJjb2duaXRvOmdyb3VwcyI6WyJldS13ZXN0LTFfR3lmNFhBVTBMX0dvb2dsZSJdLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6Im9wZW5pZCBlbWFpbCIsImF1dGhfdGltZSI6MTYxOTA4Mzc1MSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LXdlc3QtMS5hbWF6b25hd3MuY29tXC9ldS13ZXN0LTFfR3lmNFhBVTBMIiwiZXhwIjoxNjE5NTMyNzE0LCJpYXQiOjE2MTk1MjkxMTQsInZlcnNpb24iOjIsImp0aSI6ImZjZmI1ODIyLTk0ZDQtNDkxNi04ZjNmLTZhODEwMTE3NDI2NCIsImNsaWVudF9pZCI6IjMyamM3ZG4wMWhyMGpwcTFucHJhanRhaGRsIiwidXNlcm5hbWUiOiJHb29nbGVfMTEzMjkzMDUxMTU2OTI2NzMwNDU3In0.i5Mh3rC258KS1cp_4e4i-sxjQ0S5GuM8I5aoAGD7a7tCVTSLKzVlFWPPfovdtB1WPGK__SeHtazQdBb3KsR8VSvqwkNw57VU3sT2bNe4_hwZPG8sLA2nCKP_O61kK07bHz1QdRAdEXnC4zx0bgcyDB90-Lhob0n6H-gqXoZbXA-KbGbsDSBIBPvODlKzvwDsWe2wfnLJhUXhfACHME3njMUiNokSDxxLCsv0vhzyyvXKMPpq8FArA6Mwsdr2Btpjylp29757jgULixjhaoG-sob8CeTsxiNkhFPtQQv06mo2EALpnCdulP8xrY2kK5eoUZ2j_Gqx2G4cnAeLqRraLw',
  });

  const {
    data: { organisation },
  } = await client.query<{ organisation: Organisation }>({
    query: organisationUsersQuery,
    variables: {},
  });

  console.log(organisation.members.results);

  // data.reduce(async (prevRequest, entry) => {
  //   await prevRequest;
  //   console.log("###########################################");
  //   return updateUser(entry["User Id"], {
  //     group: entry["Group"],
  //     approvers: entry["Approver Emails"]
  //       .split(",")
  //       .map((email) => email.trim()),
  //     country: entry.Country,
  //   })
  //     .then(() => console.log("Successfully updated"))
  //     .catch((error) => console.log(error));
  // }, Promise.resolve());
};

run();
