import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_PROFESSIONS } from './queries';
import {
  Maybe,
  Query,
  QueryProfessionsArgs,
  Scalars,
} from 'libs/graphql/types';

const useProfessions = (qualificationID?: Maybe<Scalars['ID']>) => {
  const { data, loading } = useQuery<
    Pick<Query, 'professions'>,
    QueryProfessionsArgs
  >(QUERY_PROFESSIONS, {
    fetchPolicy: 'cache-and-network',
    skip: !qualificationID,
    variables: {
      filter: {
        qualificationID: [qualificationID ?? 0],
      },
    },
  });
  const professions = useMemo(() => data?.professions.items ?? [], [data]);

  return {
    professions,
    loading: professions.length === 0 && loading,
  };
};

export default useProfessions;
