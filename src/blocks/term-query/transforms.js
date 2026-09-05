/**
 * Block: terms, transforms.
 *
 * Converts to/from WordPress core's `core/terms-query` block.
 * Only attributes with a direct equivalent are carried over:
 * - Our `query.pages`, `query.exclude`, `query.parent`, `stickyTerms`,
 *   `namespace`, `previewTaxonomy`, and `queryId` have no `core/terms-query`
 *   equivalent and are dropped when converting to core.
 * - Core's `termQuery.showNested` has no equivalent here and is dropped when
 *   converting from core.
 * Inner blocks are walked recursively to:
 * - rename the `cr0ybot/term-template` / `core/term-template` wrapper block.
 * - remap `term-query/term` bindings to/from core's `core/term-data`, for
 *   the fields both sources support (see TERM_DATA_FIELDS below); a binding
 *   on any other field is dropped since the target source has no equivalent.
 * `term-query/term-meta` bindings have no core equivalent, so they're left
 * as-is, but they have been modified to resolve when nested under
 * `core/term-template`.
 */

import { createBlock } from '@wordpress/blocks';

const TEMPLATE_BLOCK = 'cr0ybot/term-template';
const CORE_TEMPLATE_BLOCK = 'core/term-template';

// Fields supported by both `term-query/term` (arg `key`) and core's
// `core/term-data` (arg `field`).
const TERM_DATA_FIELDS = [
	'id',
	'name',
	'link',
	'slug',
	'description',
	'parent',
	'count',
];

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

/**
 * Remaps `metadata.bindings` entries using `fromSource` to `toSource`,
 * renaming the field-name arg from `fromArgKey` to `toArgKey`. Bindings for
 * fields outside `TERM_DATA_FIELDS`, or using any other source, are left as
 * they are.
 */
function remapTermDataBindings(
	attributes,
	fromSource,
	toSource,
	fromArgKey,
	toArgKey
) {
	const bindings = attributes?.metadata?.bindings;
	if ( ! bindings ) {
		return attributes;
	}

	const newBindings = {};
	for ( const [ attributeName, binding ] of Object.entries( bindings ) ) {
		if ( binding.source !== fromSource ) {
			newBindings[ attributeName ] = binding;
			continue;
		}
		const field = binding.args?.[ fromArgKey ];
		if ( ! TERM_DATA_FIELDS.includes( field ) ) {
			continue;
		}
		const restArgs = { ...binding.args };
		delete restArgs[ fromArgKey ];
		newBindings[ attributeName ] = {
			source: toSource,
			args: { ...restArgs, [ toArgKey ]: field },
		};
	}

	return {
		...attributes,
		metadata: { ...attributes.metadata, bindings: newBindings },
	};
}

function convertBlocks(
	blocks = [],
	{ fromTemplate, toTemplate, mapAttributes }
) {
	return blocks.map( ( block ) =>
		createBlock(
			block.name === fromTemplate ? toTemplate : block.name,
			mapAttributes( block.attributes ),
			convertBlocks( block.innerBlocks, {
				fromTemplate,
				toTemplate,
				mapAttributes,
			} )
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
					convertBlocks( innerBlocks, {
						fromTemplate: TEMPLATE_BLOCK,
						toTemplate: CORE_TEMPLATE_BLOCK,
						mapAttributes: ( blockAttributes ) =>
							remapTermDataBindings(
								blockAttributes,
								'term-query/term',
								'core/term-data',
								'key',
								'field'
							),
					} )
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
					convertBlocks( innerBlocks, {
						fromTemplate: CORE_TEMPLATE_BLOCK,
						toTemplate: TEMPLATE_BLOCK,
						mapAttributes: ( blockAttributes ) =>
							remapTermDataBindings(
								blockAttributes,
								'core/term-data',
								'term-query/term',
								'field',
								'key'
							),
					} )
				),
		},
	],
};

export default transforms;
