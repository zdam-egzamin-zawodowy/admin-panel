import { gql } from '@apollo/client';

export const QUERY_PROFESSIONS = gql`
  query professions(
    $offset: Int
    $limit: Int
    $filter: ProfessionFilter
    $sort: [String!]
  ) {
    professions(offset: $offset, limit: $limit, filter: $filter, sort: $sort) {
      items {
        id
        name
      }
    }
  }
`;
