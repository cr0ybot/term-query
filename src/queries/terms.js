/**
 * Term queries.
 */

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';

import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

export const termQueryKeys = {
	all: [ 'terms' ],
	taxonomy: ( taxonomy, args = {} ) => [ ...termQueryKeys.all, { taxonomy, ...args } ],
	term: ( taxonomy, termId ) => [ ...termQueryKeys.taxonomy( taxonomy, { termId } ) ],
	search: ( taxonomy, search ) => [ ...termQueryKeys.taxonomy( taxonomy, { search } ) ],
};

/**
 * Get a term by ID.
 */
export const useTerm = ( taxonomy, termId ) => {
	const { getEntityRecord } = useSelect( ( select ) => select( coreStore ), [] );
	return useQuery({
		queryKey: termQueryKeys.term( taxonomy, termId ),
		queryFn: async () => {
			return await getEntityRecord( 'taxonomy', taxonomy, termId ) ?? null;
		},
	});
};

/**
 * Get the terms for a taxonomy.
 */
export const useTerms = ({
	taxonomy,
	per_page = 100,
	parent,
	search,
}) => {
	const {
		getEntityRecords,
		getEntityRecordsTotalPages,
	} = useSelect( ( select ) => select( coreStore ), [] );
	return useInfiniteQuery({
		queryKey: search ? termQueryKeys.search( taxonomy, search ) : termQueryKeys.taxonomy( taxonomy ),
		queryFn: async ({ pageParam = 1 }) => {
			return await getEntityRecords( 'taxonomy', taxonomy, {
				context: 'view',
				per_page,
				page: pageParam,
				parent,
				search,
			} ) ?? [];
		},
		getNextPageParam: ( lastPage, pages, lastPageParam = 1 ) => {
			const totalPages = getEntityRecordsTotalPages( 'taxonomy', taxonomy, {
				context: 'view',
				per_page,
				parent,
				search,
			} ) ?? null;
			if ( totalPages === null ) {
				return undefined;
			}
			return lastPageParam < totalPages ? lastPageParam + 1 : undefined;
		},
	});
};
