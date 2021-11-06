import { useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { useDebounce } from 'react-use';
import * as Sentry from '@sentry/react';
import { QUERY_PROFESSIONS } from './queries';
import { Profession, Query, QueryProfessionsArgs } from 'libs/graphql/types';

const useSuggestions = () => {
  const [suggestions, setSuggestions] = useState<Profession[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState<boolean>(
    false
  );
  const [search, setSearch] = useState<string>('');
  const client = useApolloClient();

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
          filter: {
            nameIEQ: '%' + search + '%',
          },
          limit: 10,
        },
      });
      if (data.professions?.items) {
        setSuggestions(data.professions.items);
      }
    } catch (e) {
      Sentry.captureException(e);
    }
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
    isLoadingSuggestions,
    suggestions,
    setSearch,
    search,
  };
};

export default useSuggestions;
