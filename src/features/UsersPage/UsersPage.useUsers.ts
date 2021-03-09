import { useQuery } from '@apollo/client';
import { QUERY_USERS } from './queries';
import { Query, QueryUsersArgs } from '../../libs/graphql/types';

const useUsers = () => {
  const {} = useQuery<Pick<Query, 'users'>, QueryUsersArgs>(QUERY_USERS, {
    fetchPolicy: 'cache-and-network',
  });
};

export default useUsers;
