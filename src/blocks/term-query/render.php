<?php
/**
 * Block: term-query, render.
 *
 * This is mainly here to handle adding the taxonomy to the block context.
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block object.
 *
 * @package term-query
 */

if ( $attributes['taxonomy'] ) {
	// phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
	$taxonomy             = $attributes['taxonomy'];
	$filter_block_context = static function ( $context ) use ( $taxonomy ) {
		$context['term-query/taxonomy'] = $taxonomy;
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
