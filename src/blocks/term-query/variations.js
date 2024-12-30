import { __ } from '@wordpress/i18n';

import {
	titleLink,
	titleDescriptionLink,
	imageTitleLink,
	imageTitleDescriptionLink,
} from './pattern-icons';

const variations = [
	{
		name: 'term-query/title-link',
		title: __( 'Title & Link', 'term-query' ),
		icon: titleLink,
		attributes: {},
		innerBlocks: [
			[
				'cr0ybot/term-template',
				{},
				[
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
					[ 'core/buttons', {}, [
						[ 'core/button', {
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
						} ],
					] ],
				],
			],
		],
		scope: [ 'block' ],
	},
	{
		name: 'term-query/title-description-link',
		title: __( 'Title, Description, & Link', 'term-query' ),
		icon: titleDescriptionLink,
		attributes: {},
		innerBlocks: [
			[
				'cr0ybot/term-template',
				{},
				[
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
											'key': 'link',
										},
									},
								},
							},
						} ],
					] ],
				],
			],
		],
		scope: [ 'block' ],
	},
	{
		name: 'term-query/image-title-link',
		title: __( 'Image, Title, & Link', 'term-query' ),
		icon: imageTitleLink,
		attributes: {},
		innerBlocks: [
			[
				'cr0ybot/term-template',
				{},
				[
					[ 'core/image', {
						metadata: {
							bindings: {
								url: {
									source: 'term-query/term-meta',
									args: {
										'key': 'thumbnail_id',
										'transform': 'attachment_id_to_url',
									},
								},
								alt: {
									source: 'term-query/term-meta',
									args: {
										'key': 'thumbnail_id',
										'transform': 'attachment_id_to_image_alt',
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
					[ 'core/buttons', {}, [
						[ 'core/button', {
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
						} ],
					] ],
				],
			],
		],
		scope: [ 'block' ],
	},
	{
		name: 'term-query/image-title-description-link',
		title: __( 'Image, Title, Description, & Link', 'term-query' ),
		icon: imageTitleDescriptionLink,
		attributes: {},
		innerBlocks: [
			[
				'cr0ybot/term-template',
				{},
				[
					[ 'core/image', {
						metadata: {
							bindings: {
								url: {
									source: 'term-query/term-meta',
									args: {
										'key': 'thumbnail_id',
										'transform': 'attachment_id_to_url',
									},
								},
								alt: {
									source: 'term-query/term-meta',
									args: {
										'key': 'thumbnail_id',
										'transform': 'attachment_id_to_image_alt',
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
											'key': 'link',
										},
									},
								},
							},
						} ],
					] ],
				],
			],
		],
		scope: [ 'block' ],
	}
];

export default variations;
