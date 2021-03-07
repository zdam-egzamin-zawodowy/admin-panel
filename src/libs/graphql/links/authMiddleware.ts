import { ApolloLink, NextLink, Operation } from "@apollo/client";
import TokenStorage from "libs/tokenstorage/TokenStorage";

const createAuthMiddleware = (tokenStorage: TokenStorage) => {
  return new ApolloLink((operation: Operation, forward: NextLink) => {
    if (tokenStorage.token) {
      operation.setContext({
        headers: {
          Authorization: "Bearer " + tokenStorage.token,
        },
      });
    }
    return forward(operation);
  });
};

export default createAuthMiddleware;
