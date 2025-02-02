=== Term Query Loop Block ===
Contributors:      cr0ybot
Tags:              block
Tested up to:      6.7
Stable tag:        0.7.0
License:           GPL-3.0-or-later
License URI:       (https://www.gnu.org/licenses/gpl-3.0.html)

Query and display taxonomy terms as blocks.

== Description ==

The provided `Taxonomy Terms` block allows you to query and display taxonomy terms--not posts--in a list or grid. It works similarly to the core `Query Loop` block, allowing you to customize the blocks and layout used to display the terms.

== Block Variations ==

The following block variations are made available by this plugin to display term data:

- **Term Title**: Heading block that displays the term title.
- **Term Description**: Paragraph block that displays the term description.
- **Term Count**: Paragraph block that displays the term count.
- **Term Link**: Button block that links to the term archive.

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/term-query` directory, or install the plugin through the WordPress plugins screen directly.
1. Activate the plugin through the 'Plugins' screen in WordPress

== Frequently Asked Questions ==

= How do I display a different term value other than the ones provided by the block variations? =

Currently, WordPress only allows setting block bindings via code, so you'll need to add a custom block variation for the paragraph, heading, image, or button block.

To display term values, use the `term-query/term` block binding with the key of the value you want to display as an argument. For example, to display the term slug in a paragraph block, you can use the following JavaScript code:

```js
registerBlockVariation( 'core/paragraph', {
	name: 'my-plugin-name/term-slug',
	title: __( 'Term Slug', 'my-plugin-name' ),
	description: __( 'Displays the slug of the current term within a Taxonomy Term block.', 'my-plugin-name' ),
	isDefault: false,
	scope: [ 'block', 'inserter', 'transform' ],
	attributes: {
		metadata: {
			bindings: {
				content: {
					source: 'term-query/term',
					args: {
						'key': 'slug',
					},
				},
			},
		},
	},
	isActive: ['metadata'],
} );
```

= How do I display custom term meta values such as images? =

Just like displaying term values, you can use the `term-query/term-meta` block binding with the key of the meta value you want to display as an argument. This binding comes with an additional `transform` argument that allows you to transform an ID value meant to indicate an attachment into a URL or image alt text. For instance, to display an image stored as an ID in the term meta field `thumbnail_id`, you can use the following JavaScript code:

```js
registerBlockVariation( 'core/image', {
	name: 'my-plugin-name/term-thumbnail',
	title: __( 'Term Thumbnail', 'my-plugin-name' ),
	description: __( 'Displays the thumbnail of the current term within a Taxonomy Term block.', 'my-plugin-name' ),
	isDefault: false,
	scope: [ 'block', 'inserter', 'transform' ],
	attributes: {
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
	},
	isActive: ['metadata'],
} );
```

= What if I need to transform a custom term meta value in a different way? =

If you need to perform transforms on term meta values other than the built-in ones for attachments, you can use your own transform key and add filters to handle the transform. For example, if you have a term meta field `color` that stores a hex color value and you want to prepend a "#", you'll need to set the block attributes to use your custom term meta key and custom transform key:

```js
{
	[...]
	attributes: {
		metadata: {
			bindings: {
				content: {
					source: 'term-query/term-meta',
					args: {
						'key': 'my_color',
						'transform: 'prepend_octothorpe',
					},
				},
			},
		},
	},
	[...]
}
```

And then you'll need to add a filter in PHP (front end):

```php
add_filter( 'term_query_term_meta_transform_prepend_octothorpe', function( $value ) {
	return '#' . $value;
} );
```

...and JS (block editor):

```js
addFilter( 'termQuery.termMetaTransform.prepend_octothorpe', 'me/my-plugin/prepend-octothorpe', function( value ) {
	return `#${value}`;
} );
```

= How else can I extend the block? =

The Term Query Loop Block has been designed to work very similarly to the core Query Loop block, and the same methods of extending that block also apply here. You can add custom block variations, register patterns, add and remove custom controls, and use filters to adjust the WP_Term_Query arguments. For more details, see the readme at https://github.com/cr0ybot/term-query/blob/main/README.md#extending-the-term-query-loop-block

= What does the ‡ symbol mean? =

The "double dagger" (‡) is a typographical mark generally used to indicate a footnote after both an asterisk (*) and a regular dagger (†) have been used.

WordPress does not currently have any iconography that represents the general concept of taxonomies or terms (just tags and categories), but the asterisk is represented in an icon for "custom post type". As Taxonomies and Terms follow closely behind Post Types as the core functionality of WordPress, I thought that the next footnote mark, the single dagger, would be a good representation of the concept of a "Taxonomy"—it is also a simple symbol, it resembles the letter "t", and reminds me of the pushpin Dashicon. The double dagger then works perfectly for the concept of a "Taxonomy Term" as a double-"t" symbol.

* Post Type, † Taxonomy, ‡ Term.

== Screenshots ==

1. Query terms of any taxonomy to display.
2. Display term data in a list or grid.
3. Inherit the "query" to display terms for the current post or child terms on a term archive.

== Changelog ==

= 0.7.0 =
* Add variation and pattern picker
* Add term_query_loop_block_query_vars filter
* Add allowedControls setting for variations
* Remove offset and pages control
* Changes to how inherit setting works, only applies to top-level block to inherit from template
* Move taxonomy attribute into query object
* Add block deprecation to migrate attributes

= 0.6.0 =
* Add Git Updater support

= 0.5.0 =
* Add parent term control

= 0.4.0 =
* Add support for nested Term Query Loop blocks, inheriting the taxonomy and term

= 0.3.2 =
* Fix lexical declaration error in JS transforms

= 0.3.1 =
* Fix child terms showing in block editor
* Fix JS error when transform is empty/invalid

= 0.3.0 =
* Added support for custom term meta transforms via filter hooks
* Added fix for WooCommerce product category images not displaying in the block editor

= 0.2.0 =
* Updated branding and screenshots

= 0.1.0 =
* Pre-release
