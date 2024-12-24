/**
 * Block: terms, edit.
 */
import { useSelect } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';

import withTermQueryProvider from '../../../queries/withTermQueryProvider';
import QueryContent from './query-content';
import QueryPlaceholder from './query-placeholder';

const TermQueryEdit = ( props ) => {
	const { attributes, clientId, context } = props;
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

	const Component = hasInnerBlocks || taxonomy || (queryIdContext && taxonomyContext) ? QueryContent : QueryPlaceholder;
	return (
		<Component
			{ ...props }
		/>
	);
};

export default withTermQueryProvider( TermQueryEdit );
