import { useMemo, useState } from 'react';
import { useApolloClient, useQuery } from '@apollo/client';
import { useDebounce } from 'react-use';
import { QUERY_PROFESSIONS } from './queries';
import {
  Maybe,
  Query,
  QueryProfessionsArgs,
  Scalars,
} from 'libs/graphql/types';
import { ExtendedProfession } from './types';

export interface Options {
  qualificationID?: Maybe<Scalars['ID']>;
  omit?: Scalars['ID'][];
}

const useProfessionAutocomplete = ({ qualificationID, omit = [] }: Options) => {
  const [suggestions, setSuggestions] = useState<ExtendedProfession[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState<boolean>(
    false
  );
  const [search, setSearch] = useState<string>('');
  const client = useApolloClient();
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

  const loadSuggestions = async (search: string) => {
    setIsLoadingSuggestions(true);
    try {
      const { data } = await client.query<
        Pick<Query, 'professions'>,
        QueryProfessionsArgs
      >({
        query: QUERY_PROFESSIONS,
        fetchPolicy: 'no-cache',
        variables: {
          filter: { nameIEQ: '%' + search + '%', idNEQ: omit },
          limit: 10,
        },
      });
      if (data.professions?.items) {
        setSuggestions(data.professions.items);
      }
    } catch (e) {}
    setIsLoadingSuggestions(false);
  };

  useDebounce(
    () => {
      loadSuggestions(search);
    },
    500,
    [search]
  );

  return {
    professions,
    get loading() {
      return this.professions.length === 0 && loading;
    },
    isLoadingSuggestions,
    suggestions,
    setSearch,
    search,
  };
};

export default useProfessionAutocomplete;
