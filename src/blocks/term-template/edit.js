/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { memo, useMemo, useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { __, _x } from '@wordpress/i18n';
import {
	BlockControls,
	BlockContextProvider,
	__experimentalUseBlockPreview as useBlockPreview,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { Spinner, ToolbarGroup } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { list, grid } from '@wordpress/icons';

const TEMPLATE = [
	[ 'core/image', {
		metadata: {
			bindings: {
				url: {
					source: 'term-query/term',
					args: {
						'key': 'meta',
						'metaKey': 'thumbnail_id',
						'transform': 'attachmentURL',
					},
				},
				alt: {
					source: 'term-query/term',
					args: {
						'key': 'meta',
						'metaKey': 'thumbnail_id',
						'transform': 'attachmentImageAlt',
					},
				},
			},
		},
	} ],
	[ 'core/heading', {
		metadata: {
			bindings: {
				content: {
					source: 'term-query/term',
					args: {
						'key': 'name',
					},
				},
			},
		},
	} ],
	[ 'core/paragraph', {
		metadata: {
			bindings: {
				content: {
					source: 'term-query/term',
					args: {
						'key': 'description',
					},
				},
			},
		},
	} ],
	[ 'core/buttons', {}, [
		[ 'core/button', {
			text: __( 'View posts', 'term-query' ),
			metadata: {
				bindings: {
					url: {
						source: 'term-query/term',
						args: {
							'key': 'url',
						},
					},
				},
			},
		} ],
	] ],
];

function TermTemplateInnerBlocks( { classList } ) {
	const innerBlocksProps = useInnerBlocksProps(
		{ className: clsx( 'wp-block-term', classList ) },
		{ template: TEMPLATE, __unstableDisableLayoutClassNames: true }
	);
	return <li { ...innerBlocksProps } />;
}

function TermTemplateBlockPreview( {
	blocks,
	blockContextId,
	classList,
	isHidden,
	setActiveBlockContextId,
} ) {
	const blockPreviewProps = useBlockPreview( {
		blocks,
		props: {
			className: clsx( 'wp-block-term', classList ),
		},
	} );

	const handleOnClick = () => {
		setActiveBlockContextId( blockContextId );
	};

	const style = {
		display: isHidden ? 'none' : undefined,
	};

	return (
		<li
			{ ...blockPreviewProps }
			tabIndex={ 0 }
			// eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
			role="button"
			onClick={ handleOnClick }
			onKeyPress={ handleOnClick }
			style={ style }
		/>
	);
}

const MemoizedTermTemplateBlockPreview = memo( TermTemplateBlockPreview );

export default function TermTemplateEdit( {
	setAttributes,
	clientId,
	context: {
		'term-query/query': {
			perPage,
			offset = 0,
			order,
			orderBy,
			include,
			exclude,
			hideEmpty,
			inherit,
			pages,
			parent = 0,
			// We gather extra query args to pass to the REST API call.
			// This way extenders of Query Loop can add their own query args,
			// and have accurate previews in the editor.
			// Noting though that these args should either be supported by the
			// REST API or be handled by custom REST filters like `rest_{$this->post_type}_query`.
			...restQueryArgs
		} = {},
		'term-query/taxonomy': taxonomy,
		'term-query/stickyTerms': stickyTerms,
		templateSlug,
		previewPostType,
	},
	attributes: { layout },
	__unstableLayoutClassNames,
} ) {
	const { type: layoutType, columnCount = 3 } = layout || {};
	const [ activeBlockContextId, setActiveBlockContextId ] = useState();
	const { terms, blocks } = useSelect(
		( select ) => {
			const { getEntityRecords } = select( coreStore );
			const { getBlocks } = select( blockEditorStore );

			const query = {
				//offset: offset || 0,
				order,
				orderby: orderBy,
			};

			if ( perPage ) {
				query.per_page = perPage;
			}
			if ( include?.length ) {
				query.include = include;
			}
			if ( exclude?.length ) {
				query.exclude = exclude;
			}
			if ( hideEmpty ) {
				query.hide_empty = true;
			}

			let fetchedStickyTerms = [];
			if ( stickyTerms?.length ) {
				fetchedStickyTerms = getEntityRecords( 'taxonomy', taxonomy, {
					include: stickyTerms,
					orderby: 'include',
				} );
			}

			// If `inherit` is truthy, adjust conditionally the query to create a better preview.
			if ( inherit ) {
				//
			}

			console.log( 'Querying taxonomy:', taxonomy );

			return {
				terms: [
					...(fetchedStickyTerms ?? []),
					...(getEntityRecords( 'taxonomy', taxonomy, {
						...query,
						...restQueryArgs,
					} ) ?? []),
				],
				blocks: getBlocks( clientId ),
			};
		},
		[
			taxonomy,
			perPage,
			offset,
			order,
			orderBy,
			clientId,
			include,
			exclude,
			parent,
			stickyTerms,
			inherit,
			templateSlug,
			restQueryArgs,
			previewPostType,
		]
	);
	const blockContexts = useMemo(
		() =>
			terms?.map( ( term ) => ( {
				'term-query/taxonomy': term.taxonomy,
				'term-query/termId': term.id,
				classList: term.class_list ?? '',
			} ) ),
		[ terms ]
	);

	const blockProps = useBlockProps( {
		className: clsx( __unstableLayoutClassNames, {
			[ `columns-${ columnCount }` ]:
				layoutType === 'grid' && columnCount, // Ensure column count is flagged via classname for backwards compatibility.
		} ),
	} );

	if ( ! terms ) {
		return (
			<p { ...blockProps }>
				<Spinner />
			</p>
		);
	}

	if ( ! terms.length ) {
		return <p { ...blockProps }> { __( 'No results found.' ) }</p>;
	}

	const setDisplayLayout = ( newDisplayLayout ) =>
		setAttributes( {
			layout: { ...layout, ...newDisplayLayout },
		} );

	const displayLayoutControls = [
		{
			icon: list,
			title: _x( 'List view', 'Term template block display setting', 'term-query' ),
			onClick: () => setDisplayLayout( { type: 'default' } ),
			isActive: layoutType === 'default' || layoutType === 'constrained',
		},
		{
			icon: grid,
			title: _x( 'Grid view', 'Term template block display setting', 'term-query' ),
			onClick: () =>
				setDisplayLayout( {
					type: 'grid',
					columnCount,
				} ),
			isActive: layoutType === 'grid',
		},
	];

	// To avoid flicker when switching active block contexts, a preview is rendered
	// for each block context, but the preview for the active block context is hidden.
	// This ensures that when it is displayed again, the cached rendering of the
	// block preview is used, instead of having to re-render the preview from scratch.
	return (
		<>
			<BlockControls>
				<ToolbarGroup controls={ displayLayoutControls } />
			</BlockControls>

			<ul { ...blockProps }>
				{ blockContexts &&
					blockContexts.map( ( blockContext ) => (
						<BlockContextProvider
							key={ blockContext['term-query/termId'] }
							value={ blockContext }
						>
							{ blockContext['term-query/termId'] ===
							( activeBlockContextId ||
								blockContexts[ 0 ]?.['term-query/termId'] ) ? (
								<TermTemplateInnerBlocks
									classList={ blockContext.classList }
								/>
							) : null }
							<MemoizedTermTemplateBlockPreview
								blocks={ blocks }
								blockContextId={ blockContext['term-query/termId'] }
								classList={ blockContext.classList }
								setActiveBlockContextId={
									setActiveBlockContextId
								}
								isHidden={
									blockContext['term-query/termId'] ===
									( activeBlockContextId ||
										blockContexts[ 0 ]?.['term-query/termId'] )
								}
							/>
						</BlockContextProvider>
					) ) }
			</ul>
		</>
	);
}
