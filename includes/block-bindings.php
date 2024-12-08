<?php
/**
 * Include: block-bindings.php
 *
 * Registers custom block bindings.
 *
 * @author    Cory Hughart <cory@coryhughart.com>
 * @copyright 2024 Cory Hughart
 * @license   https://www.gnu.org/licenses/gpl-3.0.html GPL-3.0-or-later
 * @link      https://github.com/cr0ybot/term-query
 * @package   term-query
 */

namespace cr0ybot\Term_Query\Block_Bindings;

use WP_Block;

add_action( 'init', __NAMESPACE__ . '\\register' );

/**
 * Register custom block bindings.
 */
function register() {
	// Term binding for children of terms block.
	register_block_bindings_source(
		'term-query/term',
		array(
			'label'              => __( 'Term', 'term-query' ),
			'get_value_callback' => __NAMESPACE__ . '\\get_term_value',
			'uses_context'       => array( 'term-query/termId' ),
		)
	);

	// Term meta binding for children of term block.
	register_block_bindings_source(
		'term-query/term-meta',
		array(
			'label'              => __( 'Term Meta', 'term-query' ),
			'get_value_callback' => __NAMESPACE__ . '\\get_term_meta_value',
			'uses_context'       => array( 'term-query/termId' ),
		)
	);
}

/**
 * Get the value for a term binding.
 *
 * @param array    $source_args The source args.
 * @param WP_Block $block_instance The block instance.
 * @param string   $attribute_name The attribute name.
 */
function get_term_value( array $source_args, WP_Block $block_instance, string $attribute_name ) {
	if (
		empty( $source_args['key'] )
		|| ! isset( $block_instance->context['term-query/termId'] )
	) {
		return null;
	}

	$term_id = $block_instance->context['term-query/termId'];
	if ( empty( $term_id ) ) {
		return null;
	}

	if ( 'id' === $source_args['key'] ) {
		return $term_id;
	}

	$term = get_term( $term_id );
	if ( ! $term ) {
		return null;
	}

	// Attempt to get the value directly from the term object.
	$value = $term->{ $source_args['key'] };
	if ( ! empty( $value ) ) {
		return $value;
	}

	// Additional keys that require special handling.
	return match ( $source_args['key'] ) {
		'link' => get_term_link( $term ),
		default => $term_id,
	};
}

/**
 * Get the value for a term meta binding.
 *
 * @param array    $source_args The source args.
 * @param WP_Block $block_instance The block instance.
 * @param string   $attribute_name The attribute name.
 */
function get_term_meta_value( array $source_args, WP_Block $block_instance, string $attribute_name ) {
	if (
		empty( $source_args['key'] )
		|| ! isset( $block_instance->context['term-query/termId'] )
	) {
		return null;
	}

	$term_id = $block_instance->context['term-query/termId'];
	if ( empty( $term_id ) ) {
		return null;
	}

	$meta_value = get_term_meta( $term_id, $source_args['key'], true );

	if ( ! empty( $source_args['transform'] ) ) {
		switch ( $source_args['transform'] ) {
			case 'attachmentURL':
				$meta_value = wp_get_attachment_image_src( $meta_value, 'large' );
				break;
			case 'attachmentImageAlt':
				$meta_value = get_post_meta( $meta_value, '_wp_attachment_image_alt', true );
				break;
		}
	}

	return $meta_value;
}
