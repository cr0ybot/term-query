![Term Query Loop Block banner](./assets/banner-1544x500.png)

# Term Query Loop Block Plugin

An advanced block that allows displaying taxonomy terms based on different query parameters and visual configurations, similar to the Query Loop block.

This is an attempt to fill a gap in WordPress core, see https://github.com/WordPress/gutenberg/issues/49094

Please note that this is still a work-in-progress. The plugin is not yet ready for production use. If you'd like to test it, [download the latest prerelease here](https://github.com/cr0ybot/term-query/releases/latest).

## Blocks

### Taxonomy Terms: `cr0ybot/term-query`

The Taxonomy Terms block is the main block that is used to display taxonomy terms from a term query. It is similar to the Query Loop block, but instead of querying posts from the WordPress database, it queries terms and provides [block context](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-context/) values for [block bindings](#block-bindings).

### Term Template: `cr0ybot/term-template`

The Term Template block is used to display the layout of a single term. It is similar to the Post Template block, but instead of displaying a post, it displays term information.

Inside the Term Template block, you can add [certain blocks](#block-variations) that display information about the term via block context. These blocks are simply variations of core blocks that this plugin provides to add the block bindings. You can add any other block inside the Term Template block as well, like groups and columns, to lay out the parts as you see fit.

## Block Variations

- **Term Title**: Heading block that displays the term title.
- **Term Description**: Paragraph block that displays the term description.
- **Term Count**: Paragraph block that displays the term count.
- **Term Link**: Button block that links to the term archive.

## Block Bindings

[Block bindings](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-bindings/) let you insert dynamic data into certain existing blocks. This plugin provides the following bindings with arguments:

### Term: `term-query/term`

| Argument | Possible Values | Description |
| --- | --- | --- |
| `key` | `id`, `slug`, `name`, `description`, `count`, `link`, `parent`, `slug`, `taxonomy` | The key of the term data to display. These generally correspond to the properties returned by the taxonomy REST API endpoint. |

## Term Meta: `term-query/term-meta`

| Argument | Possible Values | Description |
| --- | --- | --- |
| `key` | Any meta key | The key of the term meta to display. |
| `transform` | `attachment_id_to_url`, `attachment_id_to_image_alt`, custom transform key | A transformation to apply to the meta value. Built-in transformations are detailed below. |

### Transformations

Term meta values often contain values that must be transformed into something else to be useable, such as an attachment ID into a URL.

The following transformations are available in the plugin:

- **attachment_id_to_url**: Transforms an attachment ID into the URL of the attachment.
- **attachment_id_to_image_alt**: Transforms an attachment ID into the alt text of the attachment.

To create a custom transform, you can use the `term_query_term_meta_transform_{$transform_key}` filter in PHP for the front end and the `termQuery.termMetaTransform.{$transformKey}` filter in JavaScript for the editor. See [includes/transforms.php](/includes/transforms.php) and [src/editor/transforms.js](/src/editor/transforms.js) to reference how the built-in transforms are implemented.
