import { useQuery } from '@apollo/client';
import { QUERY_USERS } from './queries';
import { Query, QueryUsersArgs } from 'libs/graphql/types';

const useUsers = (
  page: number,
  limit: number,
  sort: string,
  search: string
) => {
  const { data, loading } = useQuery<Pick<Query, 'users'>, QueryUsersArgs>(
    QUERY_USERS,
    {
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
    }
  );

  return {
    users: data?.users.items ?? [],
    get loading() {
      return this.users.length === 0 && loading;
    },
    total: data?.users.total ?? 0,
  };
};

export default useUsers;
