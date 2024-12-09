/**
 * Editor: block variations.
 */

import { registerBlockVariation } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

registerBlockVariation( 'core/heading', {
	name: 'term-query/term-name',
	title: __( 'Term Name', 'term-query' ),
	description: __( 'Displays the name of the current term within a Taxonomy Term block.', 'term-query' ),
	isDefault: false,
	scope: [ 'block', 'inserter', 'transform' ],
	attributes: {
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
	},
	isActive: ['metadata'],
} );

registerBlockVariation( 'core/paragraph', {
	name: 'term-query/term-description',
	title: __( 'Term Description', 'term-query' ),
	description: __( 'Displays the description of the current term within a Taxonomy Term block.', 'term-query' ),
	isDefault: false,
	scope: [ 'block', 'inserter', 'transform' ],
	attributes: {
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
	},
	isActive: ['metadata'],
} );

registerBlockVariation( 'core/paragraph', {
	name: 'term-query/term-count',
	title: __( 'Term Count', 'term-query' ),
	description: __( 'Displays the count of posts in the current term within a Taxonomy Term block.', 'term-query' ),
	isDefault: false,
	scope: [ 'block', 'inserter', 'transform' ],
	attributes: {
		metadata: {
			bindings: {
				content: {
					source: 'term-query/term',
					args: {
						'key': 'count',
					},
				},
			},
		},
	},
	isActive: ['metadata'],
} );

registerBlockVariation( 'core/button', {
	name: 'term-query/term-link',
	title: __( 'Term Link', 'term-query' ),
	description: __( 'Displays a button linking to the current term archive within a Taxonomy Term block.', 'term-query' ),
	isDefault: false,
	scope: [ 'block', 'inserter', 'transform' ],
	attributes: {
		text: __( 'View posts', 'term-query' ),
		metadata: {
			bindings: {
				url: {
					source: 'term-query/term',
					args: {
						'key': 'link',
					},
				},
			},
		},
	},
	isActive: ['metadata'],
} );
