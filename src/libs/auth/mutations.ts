import { gql } from '@apollo/client';

export const MUTATION_SIGN_IN = gql`
  mutation signIn(
    $email: String!
    $password: String!
    $staySignedIn: Boolean!
  ) {
    signIn(email: $email, password: $password, staySignedIn: $staySignedIn) {
      token
      user {
        id
        displayName
        email
        role
        activated
      }
    }
  }
`;
