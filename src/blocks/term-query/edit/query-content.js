import { useSelect, useDispatch } from '@wordpress/data';
import { useInstanceId } from '@wordpress/compose';
import { useEffect } from '@wordpress/element';
import {
	BlockControls,
	BlockContextProvider,
	InspectorControls,
	useBlockProps,
	store as blockEditorStore,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';

import QueryToolbar from './query-toolbar';
import QueryInspectorControls from './inspector-controls';

const DEFAULTS_POSTS_PER_PAGE = 10;

const TEMPLATE = [ [ 'cr0ybot/term-template' ] ];

export default function QueryContent( props ) {
	const {
		attributes,
		setAttributes,
		openPatternSelectionModal,
		name,
		clientId,
		context,
	} = props;
	const {
		queryId,
		query,
		taxonomy: taxonomyAttribute,
		displayLayout,
		tagName: TagName = 'div',
		query: { inherit } = {},
	} = attributes;
	const {
		'term-query/queryId': queryIdContext,
		'term-query/taxonomy': taxonomyContext,
		'term-query/termId': termIdContext,
	} = context;
	const { __unstableMarkNextChangeAsNotPersistent } =
		useDispatch( blockEditorStore );
	const instanceId = useInstanceId( QueryContent );
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		template: TEMPLATE,
	} );
	const { postsPerPage } = useSelect( ( select ) => {
		const { getSettings } = select( blockEditorStore );
		const { getEntityRecord, canUser } = select( coreStore );
		const settingPerPage = canUser( 'read', 'settings' )
			? +getEntityRecord( 'root', 'site' )?.posts_per_page
			: +getSettings().postsPerPage;
		return {
			postsPerPage: settingPerPage || DEFAULTS_POSTS_PER_PAGE,
		};
	}, [] );

	// Maybe inherit taxonomy from global query if not set in the block.
	const taxonomyInherited = inherit && ! taxonomyAttribute && (!!queryIdContext && !!taxonomyContext);
	const taxonomy = taxonomyInherited ? taxonomyContext : taxonomyAttribute;

	// Maybe inherit parent from parent query if not set in the block.
	const parentInherited = inherit && !!termIdContext;
	const parent = parentInherited ? termIdContext : query.parent;

	/**
	 * The term-query/taxonomy context is not declared in the block.json file's
	 * `providersContext` property so that we can control the value without
	 * being beholden to the block's attribute value.
	 */
	const taxonomyContextObject = { 'term-query/taxonomy': taxonomy };

	// There are some effects running where some initialization logic is
	// happening and setting some values to some attributes (ex. queryId).
	// These updates can cause an `undo trap` where undoing will result in
	// resetting again, so we need to mark these changes as not persistent
	// with `__unstableMarkNextChangeAsNotPersistent`.

	// Changes in query property (which is an object) need to be in the same callback,
	// because updates are batched after the render and changes in different query properties
	// would cause to override previous wanted changes.
	useEffect( () => {
		const newQuery = {};
		let newInherit = inherit;
		// Update inherit if context is available.
		if ( taxonomyContext && ! inherit ) {
			newQuery.inherit = true;
			newInherit = true;
		}
		// When we inherit from global query always need to set the `perPage`
		// based on the reading settings.
		if ( newInherit && query.perPage !== postsPerPage ) {
			newQuery.perPage = postsPerPage;
		} else if ( ! query.perPage && postsPerPage ) {
			newQuery.perPage = postsPerPage;
		}
		if ( !! Object.keys( newQuery ).length ) {
			__unstableMarkNextChangeAsNotPersistent();
			updateQuery( newQuery );
		}
	}, [ query.perPage, postsPerPage, inherit, taxonomyContext ] );
	// We need this for multi-query block pagination.
	// Query parameters for each block are scoped to their ID.
	useEffect( () => {
		if ( ! Number.isFinite( queryId ) ) {
			__unstableMarkNextChangeAsNotPersistent();
			setAttributes( { queryId: instanceId } );
		}
	}, [ queryId, instanceId ] );
	const updateQuery = ( newQuery ) =>
		setAttributes( { query: { ...query, ...newQuery } } );
	const updateDisplayLayout = ( newDisplayLayout ) =>
		setAttributes( {
			displayLayout: { ...displayLayout, ...newDisplayLayout },
		} );
	const htmlElementMessages = {
		main: __(
			'The <main> element should be used for the primary content of your document only. '
		),
		section: __(
			"The <section> element should represent a standalone portion of the document that can't be better represented by another element."
		),
		aside: __(
			"The <aside> element should represent a portion of a document whose content is only indirectly related to the document's main content."
		),
	};

	return (
		<>
			<QueryInspectorControls
				{ ...props }
				setQuery={ updateQuery }
				attributes={
					{
						...attributes,
						query: { ...query, parent }, // Maybe override parent with inherited value.
						taxonomy, // Maybe override taxonomy with inherited value.
					}
				}
			/>
			<BlockControls>
				<QueryToolbar
					name={ name }
					clientId={ clientId }
					attributes={ attributes }
					setQuery={ updateQuery }
					openPatternSelectionModal={ openPatternSelectionModal }
				/>
			</BlockControls>
			<InspectorControls group="advanced">
				<SelectControl
					__nextHasNoMarginBottom
					label={ __( 'HTML element' ) }
					options={ [
						{ label: __( 'Default (<div>)' ), value: 'div' },
						{ label: '<main>', value: 'main' },
						{ label: '<section>', value: 'section' },
						{ label: '<aside>', value: 'aside' },
					] }
					value={ TagName }
					onChange={ ( value ) =>
						setAttributes( { tagName: value } )
					}
					help={ htmlElementMessages[ TagName ] }
				/>
			</InspectorControls>
			<BlockContextProvider
				value={ taxonomyContextObject }
			>
				<TagName { ...innerBlocksProps } />
			</BlockContextProvider>
		</>
	);
}
