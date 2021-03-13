import { useQuery } from '@apollo/client';
import { QUERY_QUALIFICATIONS } from './queries';
import { Query, QueryQualificationsArgs } from 'libs/graphql/types';

const useQualifications = () => {
  const { data, loading, refetch } = useQuery<
    Pick<Query, 'qualifications'>,
    QueryQualificationsArgs
  >(QUERY_QUALIFICATIONS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      sort: ['id ASC'],
    },
  });

  return {
    qualifications: data?.qualifications.items ?? [],
    get loading() {
      return this.qualifications.length === 0 && loading;
    },
    total: data?.qualifications.total ?? 0,
    refetch,
  };
};

export default useQualifications;
