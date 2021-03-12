import { gql } from '@apollo/client';

export const MUTATION_CREATE_PROFESSION = gql`
  mutation createProfession($input: ProfessionInput!) {
    createProfession(input: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_PROFESSION = gql`
  mutation updateProfession($id: ID!, $input: ProfessionInput!) {
    updateProfession(id: $id, input: $input) {
      id
    }
  }
`;

export const MUTATION_DELETE_PROFESSIONS = gql`
  mutation deleteProfessions($ids: [ID!]!) {
    deleteProfessions(ids: $ids) {
      id
    }
  }
`;
