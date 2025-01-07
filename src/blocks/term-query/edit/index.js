/**
 * Block: terms, edit.
 */
import { useSelect } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { useState } from '@wordpress/element';

import withTermQueryProvider from '../../../queries/withTermQueryProvider';
import QueryContent from './query-content';
import QueryPlaceholder from './query-placeholder';
import { PatternSelectionModal } from './pattern-selection';

const TermQueryEdit = ( props ) => {
	const { attributes, clientId, context } = props;
	const { query } = attributes;
	const [ isPatternSelectionModalOpen, setIsPatternSelectionModalOpen ] =
		useState( false );
	const {
		'term-query/query': queryContext,
	} = context;
	// Force inherit if context is present.
	const inherit = !!(queryContext ?? false) || query?.inherit;
	const taxonomy = inherit ? queryContext?.taxonomy : query?.taxonomy;

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( blockEditorStore ).getBlocks( clientId ).length,
		[ clientId ]
	);

	const Component = ( taxonomy && hasInnerBlocks ) ? QueryContent : QueryPlaceholder;
	return (
		<>
			<Component
				{ ...props }
				attributes={{
					...attributes,
					query: {
						...( inherit ? {
							// If query is inherited, leave out the taxonomy and parent.
							inherit,
							perPage: query.perPage,
							pages: query.pages,
							offset: query.offset,
							order: query.order,
							orderBy: query.orderBy,
							hideEmpty: query.hideEmpty,
							include: query.include,
							exclude: query.exclude,
						} : query ),
					}
				}}
				openPatternSelectionModal={ () =>
					setIsPatternSelectionModalOpen( true )
				}
			/>
			{ isPatternSelectionModalOpen && (
				<PatternSelectionModal
					clientId={ clientId }
					attributes={ attributes }
					setIsPatternSelectionModalOpen={
						setIsPatternSelectionModalOpen
					}
				/>
			) }
		</>
	);
};

export default withTermQueryProvider( TermQueryEdit );
