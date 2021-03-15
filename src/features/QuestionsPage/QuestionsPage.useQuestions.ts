import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_QUESTIONS } from './queries';
import { Query, QueryQuestionsArgs } from 'libs/graphql/types';

const useQuestions = (
  page: number,
  limit: number,
  sort: string,
  search: string
) => {
  const { data, loading, refetch } = useQuery<
    Pick<Query, 'questions'>,
    QueryQuestionsArgs
  >(QUERY_QUESTIONS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      offset: page * limit,
      sort: [sort],
      limit,
      filter: {
        contentIEQ: '%' + search + '%',
      },
    },
  });
  const questions = useMemo(() => data?.questions.items ?? [], [data]);

  return {
    questions,
    loading: questions.length === 0 && loading,
    total: data?.questions.total ?? 0,
    refetch,
  };
};

export default useQuestions;
