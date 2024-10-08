import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { generateQueryKey, RequestKey, StaleTime } from '../../lib/query';
import {
  UseSearchProvider,
  UseSearchProviderProps,
  useSearchProvider,
} from './useSearchProvider';
import {
  defaultSearchSuggestionsLimit,
  minSearchQueryLength,
} from '../../graphql/search';
import useDebounce from '../useDebounce';
import { defaultSearchDebounceMs } from '../../lib/func';

export type UseSearchProviderSuggestionsProps = {
  limit?: number;
} & UseSearchProviderProps;

export type UseSearchProviderSuggestions = {
  isLoading: boolean;
  suggestions: Awaited<ReturnType<UseSearchProvider['getSuggestions']>>;
};

export const useSearchProviderSuggestions = ({
  provider,
  query,
  limit = defaultSearchSuggestionsLimit,
}: UseSearchProviderSuggestionsProps): UseSearchProviderSuggestions => {
  const { user } = useAuthContext();
  const { getSuggestions } = useSearchProvider();
  const debouncedQuery = useDebounce(query, defaultSearchDebounceMs);

  const { data, isLoading } = useQuery(
    generateQueryKey(RequestKey.Search, user, 'suggestions', {
      provider,
      debouncedQuery,
      limit,
    }),
    async () => {
      return getSuggestions({ provider, query: debouncedQuery, limit });
    },
    {
      enabled: query?.length >= minSearchQueryLength,
      staleTime: StaleTime.Default,
      select: useCallback(
        (currentData) => {
          if (!currentData) {
            return currentData;
          }

          return {
            ...currentData,
            hits: currentData?.hits?.slice(0, limit) || [],
          };
        },
        [limit],
      ),
    },
  );

  return {
    isLoading,
    suggestions: data,
  };
};
