/**
 * Editor: block bindings.
 */

import { registerBlockBindingsSource } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { store as coreDataStore } from '@wordpress/core-data';

const TERM_KEYS = [
	'count',
	'description',
	'id',
	'link',
	'name',
	'parent',
	'slug',
	'taxonomy',
];

/**
 * Term binding for children of terms block.
 */
registerBlockBindingsSource( {
	'name': 'term-query/term',
	usesContext: [ 'term-query/termId', 'term-query/taxonomy' ],
	getValues( { select, context, bindings } ) {
		const values = {};

		// Get the term id & taxonomy from the context.
		const termId = context[ 'term-query/termId' ];
		const taxonomy = context[ 'term-query/taxonomy' ];

		// Get the term object from the store.
		const term = select( coreDataStore ).getEntityRecord( 'taxonomy', taxonomy, termId );
		if ( ! term ) {
			return values;
		}

		for ( const [attributeName, source ] of Object.entries( bindings ) ) {
			const { key } = source.args;

			if ( TERM_KEYS.includes( key ) ) {
				values[ attributeName ] = term[ key ];
			}
		}

		return values;
	},
	canUserEditValue() {
		return false;
	},
	getFieldsList( { select, context } ) {
		// Get the term id & taxonomy from the context.
		const termId = context[ 'term-query/termId' ];
		const taxonomy = context[ 'term-query/taxonomy' ];

		// Get the term object from the store.
		const term = select( coreDataStore ).getEntityRecord( 'taxonomy', taxonomy, termId );
		if ( ! term ) {
			return [];
		}

		// Return only the keys that are present in the term object.
		return TERM_KEYS.reduce( ( acc, key ) => {
			if ( term[ key ] ) {
				acc[ key ] = {
					label: __( key, 'term-query' ),
					value: term[ key ],
				}
			}
		}, {} );
	}
} );

/**
 * Term meta binding for children of terms block.
 */
registerBlockBindingsSource( {
	'name': 'term-query/term-meta',
	usesContext: [ 'term-query/termId' ],
	getValues( { select, context, bindings } ) {
		const values = {};

		// Get the term id & taxonomy from the context.
		const termId = context[ 'term-query/termId' ];
		const taxonomy = context[ 'term-query/taxonomy' ];

		// Get the term object from the store.
		const term = select( coreDataStore ).getEntityRecord( 'taxonomy', taxonomy, termId );
		if ( ! term ) {
			return values;
		}

		const { meta } = term;

		for ( const [attributeName, source ] of Object.entries( bindings ) ) {
			const { key, transform } = source.args;

			if ( meta[ key ] ) {

				if ( transform ) {
					values[ attributeName ] = transformValue( meta[ key ], transform, select );
				} else {
					values[ attributeName ] = meta[ key ];
				}
			}
		}

		return values;
	},
	canUserEditValue() {
		return false;
	},
	getFieldsList( { select, context } ) {
		// Get the term id & taxonomy from the context.
		const termId = context[ 'term-query/termId' ];
		const taxonomy = context[ 'term-query/taxonomy' ];

		// Get the term object from the store.
		const term = select( coreDataStore ).getEntityRecord( 'taxonomy', taxonomy, termId );
		if ( ! term ) {
			return [];
		}

		const { meta } = term;

		// Return only the keys that are present in the term meta object.
		return Object.keys( meta ).reduce( ( acc, key ) => {
			acc[ key ] = {
				label: __( key, 'term-query' ),
				value: meta[ key ],
			};
		}, {} );
	}
} );

/**
 * Transform the value based on the transform type.
 */
function transformValue( value, type, select ) {
	switch ( type ) {
		case 'attachmentURL':
			return select( coreDataStore ).getMedia( value )?.source_url;
		case 'attachmentImageAlt':
			return select( coreDataStore ).getMedia( value )?.alt_text;
		default:
			return value;
	}
}
