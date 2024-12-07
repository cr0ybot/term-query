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
}

/**
 * Get the value for a term binding.
 *
 * @param array    $source_args The source args.
 * @param WP_Block $block_instance The block instance.
 * @param string   $attribute_name The attribute name.
 */
function get_term_value( array $source_args, WP_Block $block_instance, string $attribute_name ) {
	if ( empty( $source_args['key'] ) ) {
		return null;
	}

	if ( empty( $block_instance->context['term-query/termId'] ) ) {
		return null;
	}
	$term_id = $block_instance->context['term-query/termId'];

	if ( $source_args['key'] === 'id' ) {
		return $term_id;
	}

	$term = get_term( $term_id );
	if ( ! $term ) {
		return null;
	}

	if ( $source_args['key'] === 'meta' ) {
		if ( empty( $source_args['metaKey'] ) ) {
			return null;
		}

		return get_term_meta( $term_id, $source_args['metaKey'], true );
	}

	return match ( $source_args['key'] ) {
		'name' => $term->name,
		'slug' => $term->slug,
		'description' => $term->description,
		'taxonomy' => $term->taxonomy,
		'url' => get_term_link( $term ),
		'count' => $term->count,
		// @todo Need a more robust method for fetching attachment image/alt text from an ID in term meta.
		'image' => wp_get_attachment_image_src( get_term_meta( $term_id, 'thumbnail_id', true ), 'large' ),
		'imageAlt' => get_post_meta( get_term_meta( $term_id, 'thumbnail_id', true ), '_wp_attachment_image_alt', true ),
		default => $term_id,
	};
}
