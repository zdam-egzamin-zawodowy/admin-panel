import { gql } from '@apollo/client';

export const QUERY_QUALIFICATIONS = gql`
  query qualifications(
    $offset: Int
    $limit: Int
    $filter: QualificationFilter
    $sort: [String!]
  ) {
    qualifications(
      offset: $offset
      limit: $limit
      filter: $filter
      sort: $sort
    ) {
      total
      items {
        id
        name
        code
      }
    }
  }
`;
