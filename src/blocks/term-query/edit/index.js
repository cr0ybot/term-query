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
	const [ isPatternSelectionModalOpen, setIsPatternSelectionModalOpen ] =
		useState( false );
	const { taxonomy } = attributes;
	const {
		'term-query/queryId': queryIdContext,
		'term-query/taxonomy': taxonomyContext,
	} = context;

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( blockEditorStore ).getBlocks( clientId ).length,
		[ clientId ]
	);

	const Component = ( taxonomy && hasInnerBlocks ) || (queryIdContext && taxonomyContext) ? QueryContent : QueryPlaceholder;
	return (
		<>
			<Component
				{ ...props }
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
