import { gql } from '@apollo/client';

export const MUTATION_CREATE_QUALIFICATION = gql`
  mutation createProfession($input: QualificationInput!) {
    createQualification(input: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_QUALIFICATION = gql`
  mutation updateQualification($id: ID!, $input: QualificationInput!) {
    updateQualification(id: $id, input: $input) {
      id
    }
  }
`;

export const MUTATION_DELETE_QUALIFICATIONS = gql`
  mutation deleteQualifications($ids: [ID!]!) {
    deleteQualifications(ids: $ids) {
      id
    }
  }
`;
