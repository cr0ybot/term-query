<?php
/**
 * Block: term-template, render.
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block object.
 *
 * @package term-query
 */

if ( ! function_exists( 'ctq_build_query_vars_from_term_query_block' ) ) {

	/**
	 * Build query vars from term query block.
	 *
	 * @param WP_Block $block The block object.
	 * @param int      $page The current page.
	 * @param array    $args Additional query args.
	 */
	function ctq_build_query_vars_from_term_query_block( $block, $page, $args = array() ) {
		if ( ! isset( $block->context['term-query/query'] ) ) {
			return null;
		}

		$query_args = array();

		$context_query = $block->context['term-query/query'];

		$per_page = $context_query['perPage'] ?? 100;

		$query_args['taxonomy']   = $context_query['taxonomy'];
		$query_args['offset']     = ( ( $page - 1 ) * $per_page );
		$query_args['number']     = $per_page;
		$query_args['orderby']    = $context_query['orderBy'] ?? 'name';
		$query_args['order']      = strtoupper( $context_query['order'] ?? 'asc' );
		$query_args['hide_empty'] = $context_query['hideEmpty'] ?? false;
		$query_args['include']    = $context_query['include'] ?? array();
		$query_args['exclude']    = $context_query['exclude'] ?? array();
		$query_args['parent']     = $context_query['parent'] ?? 0;

		// Merge with additional args.
		$query_args = array_merge( $query_args, $args );

		/**
		 * Filters the arguments which will be passet to `WP_Term_Query` for the
		 * Term Query Loop Block.
		 *
		 * Anything that is returned from this filter should be compatible with
		 * the `WP_Term_Query` API to form the query context which will be
		 * passed down to the block's children. This can help, for example, to
		 * include additional settings or meta queries not directly supported by
		 * the block's settings, and extend its capabilities.
		 *
		 * Please note that this will only influence the query that will be
		 * rendered on the front end. The editor preview is not affected by this
		 * filter. Also, it is worth noting that the editor preview uses the
		 * REST API, so, ideally, one should aim to provide attributes which are
		 * also compatible with the REST API in order to be able to implement
		 * identical queries on both sides.
		 *
		 * @since 0.7.0
		 *
		 * @param array   $query_args Array containing arguments for `WP_Term_Query` as parsed by the block context.
		 * @param WP_Block $block The block instance.
		 * @param int      $page The current query's page.
		 */
		return apply_filters( 'term_query_loop_block_query_vars', $query_args, $block, $page );
	}
}

$page_key = isset( $block->context['term-query/queryId'] ) ? 'query-' . $block->context['term-query/queryId'] . '-page' : 'query-page';
// phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited, WordPress.Security.NonceVerification.Recommended
$page = empty( $_GET[ $page_key ] ) ? 1 : (int) $_GET[ $page_key ];

// If termId is provided in context, this is a nested term query block and we should use that as the parent.
if ( isset( $block->context['term-query/termId'] ) ) {
	// If termId is already provided in context, use that as parent.
	$term_id    = $block->context['term-query/termId'];
	$query_args = ctq_build_query_vars_from_term_query_block(
		$block,
		$page,
		array(
			'parent' => $term_id,
		),
	);
	if ( empty( $query_args ) ) {
		return '';
	}
	$query = new WP_Term_Query( $query_args );
	$terms = $query->get_terms();
} else {
	// Use global query if needed.
	$use_global_query = ( isset( $block->context['term-query/query']['inherit'] ) && $block->context['term-query/query']['inherit'] );
	if ( $use_global_query ) {

		global $wp_query;

		$context_query = $block->context['term-query/query'];

		if ( ! in_the_loop() && ( is_category() || is_tag() || is_tax() ) ) {
			/**
			 * If the global query is for a term archive, get the child terms.
			 *
			 * Note: This is a little awkward since the taxonomy must be selected in
			 * the block settings currently.
			 *
			 * @todo Inherit taxonomy?
			 */
			$terms = get_terms(
				array(
					'taxonomy'   => $context_query['taxonomy'],
					'parent'     => $wp_query->get_queried_object_id(),
					'hide_empty' => $context_query['hideEmpty'],
				)
			);
		} elseif ( is_single() || in_the_loop() ) {
			/**
			 * If the global query is for a single post or we're in the main loop,
			 * get the terms from the post.
			 */
			$terms = get_the_terms( get_the_ID(), $context_query['taxonomy'] );
		} elseif ( isset( $block->context['postId'] ) ) {
			/**
			 * Otherwise, get the postID from context.
			 */
			// phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
			$post_id = $block->context['postId'];
			$terms   = get_the_terms( $post_id, $context_query['taxonomy'] );
		} else {
			$terms = array();
		}
	} else {
		$query_args = ctq_build_query_vars_from_term_query_block( $block, $page );
		if ( empty( $query_args ) ) {
			return '';
		}
		$query = new WP_Term_Query( $query_args );
		$terms = $query->get_terms();
	}
}

if ( empty( $terms ) ) {
	return '';
}

$classnames = '';
if ( isset( $block->context['term-query/displayLayout'] ) && isset( $block->context['term-query/query'] ) ) {
	if ( isset( $block->context['term-query/displayLayout']['type'] ) && 'flex' === $block->context['term-query/displayLayout']['type'] ) {
		$classnames = "is-flex-container columns-{$block->context['term-query/displayLayout']['columns']}";
	}
}
if ( isset( $attributes['style']['elements']['link']['color']['text'] ) ) {
	$classnames .= ' has-link-color';
}

// Ensure backwards compatibility by flagging the number of columns via classname when using grid layout.
if ( isset( $attributes['layout']['type'] ) && 'grid' === $attributes['layout']['type'] && ! empty( $attributes['layout']['columnCount'] ) ) {
	$classnames .= ' ' . sanitize_title( 'columns-' . $attributes['layout']['columnCount'] );
}

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => trim( $classnames ) ) );

$content = '';
// phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
foreach ( $terms as $term ) {

	// Get an instance of the current Post Template block.
	$block_instance = $block->parsed_block;

	// Set the block name to one that does not correspond to an existing registered block.
	// This ensures that for the inner instances of the Post Template block, we do not render any block supports.
	$block_instance['blockName'] = 'core/null';

	$term_id              = $term->term_id;
	$filter_block_context = static function ( $context ) use ( $term_id ) {
		$context['term-query/termId'] = $term_id;
		return $context;
	};

	// Use an early priority to so that other 'render_block_context' filters have access to the values.
	add_filter( 'render_block_context', $filter_block_context, 1 );
	// Render the inner blocks of the Post Template block with `dynamic` set to `false` to prevent calling
	// `render_callback` and ensure that no wrapper markup is included.
	$block_content = ( new WP_Block( $block_instance ) )->render( array( 'dynamic' => false ) );
	remove_filter( 'render_block_context', $filter_block_context, 1 );

	// Wrap the render inner blocks in a `li` element with the appropriate term classes.
	$term_classes = 'wp-block-term tax-' . $term->taxonomy . ' term-' . $term->slug . ' term-' . $term->term_id . ' ' . $term->taxonomy . '-' . $term->slug;

	$content .= '<li class="' . esc_attr( $term_classes ) . '">' . $block_content . '</li>';
}

// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped
printf(
	'<ul %1$s>%2$s</ul>',
	$wrapper_attributes,
	$content
);
// phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped
