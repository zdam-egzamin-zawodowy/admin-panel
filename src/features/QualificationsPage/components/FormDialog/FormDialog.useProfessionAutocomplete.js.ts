import { useMemo, useState } from 'react';
import { useApolloClient, useQuery } from '@apollo/client';
import { Control, useFieldArray } from 'react-hook-form';
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
  control: Control;
}

const useProfessionAutocomplete = ({ qualificationID, control }: Options) => {
  const [suggestions, setSuggestions] = useState<ExtendedProfession[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState<boolean>(
    false
  );
  const [search, setSearch] = useState<string>('');
  const { fields: selectedProfessions } = useFieldArray<
    ExtendedProfession,
    'key'
  >({
    control,
    name: 'professions',
    keyName: 'key',
  });
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
  const autocompleteOptions: typeof selectedProfessions = useMemo(() => {
    return [
      ...suggestions
        .filter(
          profession =>
            !selectedProfessions.some(
              otherProfession => otherProfession.id === profession.id
            )
        )
        .map(p => ({ ...p, disabled: false })),
      ...selectedProfessions.map(p => ({
        ...p,
        disabled: true,
      })),
    ];
  }, [suggestions, selectedProfessions]);

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
            idNEQ: selectedProfessions.map(profession => profession.id ?? 0),
          },
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
    loading: professions.length === 0 && loading,
    isLoadingSuggestions,
    suggestions,
    setSearch,
    search,
    autocompleteOptions,
    selectedProfessions,
  };
};

export default useProfessionAutocomplete;
