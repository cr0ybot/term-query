<?php
/**
 * Block: term-template, render.
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block object.
 *
 * @package RTG.fish
 */

if ( ! function_exists( 'rtg_build_query_vars_from_term_block' ) ) {
	function rtg_build_term_query_vars_from_term_block( $block, $page ) {
		$query_args = array(
			'offset' => 0,
		);

		if ( isset( $block->context['cr0ybot/query'] ) ) {
			$context_query = $block->context['cr0ybot/query'];
			$taxonomy      = $block->context['cr0ybot/taxonomy'];

			$query_args['taxonomy']   = $taxonomy;
			$query_args['offset']     = ( $page - 1 ) * $context_query['perPage'];
			$query_args['number']     = $context_query['perPage'];
			$query_args['orderby']    = $context_query['orderBy'];
			$query_args['order']      = $context_query['order'];
			$query_args['hide_empty'] = $context_query['hideEmpty'];
			$query_args['include']    = $context_query['include'];
			$query_args['exclude']    = $context_query['exclude'];
			$query_args['parent']     = $context_query['parent'];
		}

		return $query_args;
	}
}

$page_key = isset( $block->context['cr0ybot/queryId'] ) ? 'query-' . $block->context['cr0ybot/queryId'] . '-page' : 'query-page';
$page     = empty( $_GET[ $page_key ] ) ? 1 : (int) $_GET[ $page_key ];

// Use global query if needed.
$use_global_query = ( isset( $block->context['cr0ybot/query']['inherit'] ) && $block->context['cr0ybot/query']['inherit'] );
if ( $use_global_query ) {
	global $wp_query;

	/*
	 * If the global query is for a single post or we're in the main loop,
	 * get the terms from the post.
	 */
	if ( is_single() || in_the_loop() ) {
		$terms = get_the_terms( get_the_ID(), $block->context['cr0ybot/taxonomy'] );
	}
	/*
	 * Otherwise, get the postID from context.
	 */
	else {
		$post_id = $block->context['postId'];
		$terms   = get_the_terms( $post_id, $block->context['cr0ybot/taxonomy'] );
	}
} else {
	$query_args = rtg_build_term_query_vars_from_term_block( $block, $page );
	$query      = new WP_Term_Query( $query_args );
	$terms      = $query->get_terms();
}

if ( empty( $terms ) ) {
	return '';
}

$classnames = '';
if ( isset( $block->context['cr0ybot/displayLayout'] ) && isset( $block->context['cr0ybot/query'] ) ) {
	if ( isset( $block->context['cr0ybot/displayLayout']['type'] ) && 'flex' === $block->context['cr0ybot/displayLayout']['type'] ) {
		$classnames = "is-flex-container columns-{$block->context['cr0ybot/displayLayout']['columns']}";
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
foreach ( $terms as $term ) {

	// Get an instance of the current Post Template block.
	$block_instance = $block->parsed_block;

	// Set the block name to one that does not correspond to an existing registered block.
	// This ensures that for the inner instances of the Post Template block, we do not render any block supports.
	$block_instance['blockName'] = 'core/null';

	$term_id              = $term->term_id;
	$taxonomy             = $term->taxonomy;
	$filter_block_context = static function ( $context ) use ( $term_id, $taxonomy ) {
		$context['cr0ybot/taxonomy'] = $taxonomy;
		$context['cr0ybot/termId']   = $term_id;
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
