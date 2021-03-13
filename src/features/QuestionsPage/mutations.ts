import { gql } from '@apollo/client';

export const MUTATION_CREATE_QUESTION = gql`
  mutation createQuestion($input: QuestionInput!) {
    createQuestion(input: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_QUESTION = gql`
  mutation updateQuestion($id: ID!, $input: QuestionInput!) {
    updateQuestion(id: $id, input: $input) {
      id
    }
  }
`;

export const MUTATION_DELETE_QUESTIONS = gql`
  mutation deleteQuestions($ids: [ID!]!) {
    deleteQuestions(ids: $ids) {
      id
    }
  }
`;
