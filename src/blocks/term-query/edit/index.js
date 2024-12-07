/**
 * Block: terms, edit.
 */
import { useSelect } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';

import QueryContent from './query-content';
import QueryPlaceholder from './query-placeholder';

const QueryEdit = ( props ) => {
	const { attributes, clientId } = props;
	const { taxonomy } = attributes;
	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( blockEditorStore ).getBlocks( clientId ).length,
		[ clientId ]
	);
	const Component = hasInnerBlocks || taxonomy ? QueryContent : QueryPlaceholder;
	return (
		<Component
			{ ...props }
		/>
	);
};

export default QueryEdit;
