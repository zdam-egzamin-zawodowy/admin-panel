import { useQuery } from '@apollo/client';
import { QUERY_USERS } from './queries';
import { Query, QueryUsersArgs } from 'libs/graphql/types';
import { useMemo } from 'react';

const useUsers = (
  page: number,
  limit: number,
  sort: string,
  search: string
) => {
  const { data, loading, refetch } = useQuery<
    Pick<Query, 'users'>,
    QueryUsersArgs
  >(QUERY_USERS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      offset: page * limit,
      sort: [sort],
      limit,
      filter: {
        or: {
          displayNameIEQ: '%' + search + '%',
          emailIEQ: '%' + search + '%',
        },
      },
    },
  });
  const users = useMemo(() => data?.users.items ?? [], [data]);

  return {
    users,
    loading: users.length === 0 && loading,
    total: data?.users.total ?? 0,
    refetch,
  };
};

export default useUsers;
