import { gql } from '@apollo/client';

export const QUERY_USERS = gql`
  query users(
    $offset: Int
    $limit: Int
    $filter: UserFilter
    $sort: [String!]
  ) {
    query
    users(offset: $offset, limit: $limit, filter: $filter, sort: $sort) {
      total
      items {
        id
        activated
        displayName
        email
        role
      }
    }
  }
`;
