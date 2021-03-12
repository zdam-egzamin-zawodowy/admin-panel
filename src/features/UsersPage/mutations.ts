import { gql } from '@apollo/client';

export const MUTATION_CREATE_USER = gql`
  mutation createUser($input: UserInput!) {
    createUser(input: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_USER = gql`
  mutation updateUser($id: ID!, $input: UserInput!) {
    updateUser(id: $id, input: $input) {
      id
    }
  }
`;
