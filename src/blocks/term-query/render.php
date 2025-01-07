<?php
/**
 * Block: term-query, render.
 *
 * This is mainly here to handle adding the query to the block context.
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block object.
 *
 * @package term-query
 */

// Check the parsed block for an empty query attribute to bypass the defaults.
$inherit = ! isset( $block->parsed_block['attrs']['query'] ) || $attributes['query']['inherit'] ?? isset( $context['term-query/query'] );

if ( ! $inherit ) {
	$query_context        = $attributes['query'];
	$filter_block_context = static function ( $context ) use ( $query_context ) {
		$context['term-query/query'] = $query_context;
		return $context;
	};

	$block_instance = $block->parsed_block;

	// Use an early priority to so that other 'render_block_context' filters have access to the values.
	add_filter( 'render_block_context', $filter_block_context, 1 );
	// Render the inner blocks of the Term Query Loop block with `dynamic` set to `false` to prevent calling
	// `render_callback` and ensure that no wrapper markup is included.
	$block_content = ( new WP_Block( $block_instance ) )->render( array( 'dynamic' => false ) );
	remove_filter( 'render_block_context', $filter_block_context, 1 );

	$content = $block_content;
}

// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
echo $content;
