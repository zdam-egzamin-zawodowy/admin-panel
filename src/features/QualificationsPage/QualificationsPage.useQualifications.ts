import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_QUALIFICATIONS } from './queries';
import { Query, QueryQualificationsArgs } from 'libs/graphql/types';

const useQualifications = (
  page: number,
  limit: number,
  sort: string,
  search: string
) => {
  const { data, loading, refetch } = useQuery<
    Pick<Query, 'qualifications'>,
    QueryQualificationsArgs
  >(QUERY_QUALIFICATIONS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      offset: page * limit,
      sort: [sort],
      limit,
      filter: {
        or: {
          nameIEQ: '%' + search + '%',
          codeIEQ: '%' + search + '%',
        },
      },
    },
  });
  const qualifications = useMemo(() => data?.qualifications.items ?? [], [
    data,
  ]);

  return {
    qualifications,
    loading: qualifications.length === 0 && loading,
    total: data?.qualifications.total ?? 0,
    refetch,
  };
};

export default useQualifications;
