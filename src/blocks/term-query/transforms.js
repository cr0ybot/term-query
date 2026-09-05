/**
 * Block: terms, transforms.
 *
 * Converts to/from WordPress core's `core/terms-query` block, which was
 * based on this block. Only attributes with a direct equivalent on the
 * other side are carried over:
 * - `query.pages`, `query.exclude`, `query.parent`, `stickyTerms`,
 *   `namespace`, `previewTaxonomy`, and `queryId` have no `core/terms-query`
 *   equivalent and are dropped when converting to core.
 * - `termQuery.showNested` has no equivalent here and is dropped when
 *   converting from core.
 * Inner `core/term-template` blocks use dedicated child blocks (e.g.
 * `core/term-name`) instead of block bindings, so only the template block
 * itself is renamed; any bound content inside it won't carry over.
 */

import { createBlock } from '@wordpress/blocks';

const TEMPLATE_BLOCK = 'cr0ybot/term-template';
const CORE_TEMPLATE_BLOCK = 'core/term-template';

const DEFAULT_QUERY = {
	taxonomy: '',
	perPage: 100,
	pages: 0,
	order: 'asc',
	orderBy: 'name',
	hideEmpty: true,
	include: [],
	exclude: [],
	inherit: false,
	parent: 0,
};

const DEFAULT_CORE_TERM_QUERY = {
	perPage: 10,
	taxonomy: 'category',
	order: 'asc',
	orderBy: 'name',
	include: [],
	hideEmpty: true,
	showNested: false,
	inherit: false,
};

const SHARED_QUERY_KEYS = [
	'taxonomy',
	'perPage',
	'order',
	'orderBy',
	'include',
	'hideEmpty',
	'inherit',
];

function pick( object = {}, keys ) {
	return keys.reduce( ( picked, key ) => {
		if ( object[ key ] !== undefined ) {
			picked[ key ] = object[ key ];
		}
		return picked;
	}, {} );
}

function renameBlocks( blocks = [], fromName, toName ) {
	return blocks.map( ( block ) =>
		createBlock(
			block.name === fromName ? toName : block.name,
			block.attributes,
			renameBlocks( block.innerBlocks, fromName, toName )
		)
	);
}

const transforms = {
	to: [
		{
			type: 'block',
			blocks: [ 'core/terms-query' ],
			transform: ( attributes, innerBlocks ) =>
				createBlock(
					'core/terms-query',
					{
						termQuery: {
							...DEFAULT_CORE_TERM_QUERY,
							...pick( attributes.query, SHARED_QUERY_KEYS ),
						},
						tagName: attributes.tagName,
					},
					renameBlocks(
						innerBlocks,
						TEMPLATE_BLOCK,
						CORE_TEMPLATE_BLOCK
					)
				),
		},
	],
	from: [
		{
			type: 'block',
			blocks: [ 'core/terms-query' ],
			transform: ( attributes, innerBlocks ) =>
				createBlock(
					'cr0ybot/term-query',
					{
						query: {
							...DEFAULT_QUERY,
							...pick( attributes.termQuery, SHARED_QUERY_KEYS ),
						},
						tagName: attributes.tagName,
					},
					renameBlocks(
						innerBlocks,
						CORE_TEMPLATE_BLOCK,
						TEMPLATE_BLOCK
					)
				),
		},
	],
};

export default transforms;
