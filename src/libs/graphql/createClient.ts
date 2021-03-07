import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  ApolloLink,
} from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { onError } from "@apollo/client/link/error";
import createAuthMiddleware from "./links/authMiddleware";
import TokenStorage from "libs/tokenstorage/TokenStorage";

const createClient = (
  uri: string,
  tokenStorage: TokenStorage
): ApolloClient<NormalizedCacheObject> => {
  return new ApolloClient({
    queryDeduplication: true,
    cache: new InMemoryCache(),
    link: ApolloLink.from([
      createAuthMiddleware(tokenStorage),
      onError(({ graphQLErrors, networkError }) => {
        if (process.env.NODE_ENV === "development") {
          if (graphQLErrors)
            graphQLErrors.map(({ message, locations, path }) =>
              console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
              )
            );
          if (networkError) console.log(`[Network error]: ${networkError}`);
        }
      }),
      createUploadLink({
        uri,
      }),
    ]),
  });
};

export default createClient;
