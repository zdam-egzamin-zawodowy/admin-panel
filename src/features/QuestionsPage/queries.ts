import { gql } from '@apollo/client';

export const QUERY_QUESTIONS = gql`
  query questions(
    $offset: Int
    $limit: Int
    $filter: QuestionFilter
    $sort: [String!]
  ) {
    questions(offset: $offset, limit: $limit, filter: $filter, sort: $sort) {
      total
      items {
        id
        content
        image
        from
        answerA
        answerAImage
        answerB
        answerBImage
        answerC
        answerCImage
        answerD
        answerDImage
        explanation
        correctAnswer
        qualification {
          id
          code
        }
        createdAt
        updatedAt
      }
    }
  }
`;
