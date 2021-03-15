import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_PROFESSIONS } from './queries';
import { Query, QueryProfessionsArgs } from 'libs/graphql/types';

const useProfessions = (
  page: number,
  limit: number,
  sort: string,
  search: string
) => {
  const { data, loading, refetch } = useQuery<
    Pick<Query, 'professions'>,
    QueryProfessionsArgs
  >(QUERY_PROFESSIONS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      offset: page * limit,
      sort: [sort],
      limit,
      filter: {
        nameIEQ: '%' + search + '%',
      },
    },
  });
  const professions = useMemo(() => data?.professions.items ?? [], [data]);

  return {
    professions,
    loading: professions.length === 0 && loading,
    total: data?.professions.total ?? 0,
    refetch,
  };
};

export default useProfessions;
