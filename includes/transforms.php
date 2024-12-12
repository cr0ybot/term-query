<?php
/**
 * Include: transforms.php
 *
 * Registers term query term meta transform filters.
 *
 * @author    Cory Hughart <cory@coryhughart.com>
 * @copyright 2024 Cory Hughart
 * @license   https://www.gnu.org/licenses/gpl-3.0.html GPL-3.0-or-later
 * @link      https://github.com/cr0ybot/term-query
 * @package   term-query
 */

namespace cr0ybot\Term_Query\Transforms;

add_filter( 'term_query_term_meta_transform_attachment_id_to_url', __NAMESPACE__ . '\\attachment_id_to_url', 10, 2 );
add_filter( 'term_query_term_meta_transform_attachment_id_to_image_alt', __NAMESPACE__ . '\\attachment_id_to_image_alt', 10, 2 );

/**
 * Transform to attachment URL.
 *
 * @param mixed $meta_value The meta value, an attachment ID.
 * @param array $args The binding args.
 * @return string|null The attachment URL or null.
 */
function attachment_id_to_url( mixed $meta_value, array $args ) {
	if ( ! is_numeric( $meta_value ) ) {
		return null;
	}

	$url = wp_get_attachment_image_url( $meta_value, $args['size'] ?? 'full' );
	if ( ! $url ) {
		return null;
	}

	return $url;
}

/**
 * Transform to attachment image alt text.
 *
 * @param mixed $meta_value The meta value, an attachment ID.
 * @param array $args The binding args.
 * @return string|null The attachment alt text or null.
 */
function attachment_id_to_image_alt( mixed $meta_value, array $args ) {
	if ( ! is_numeric( $meta_value ) ) {
		return null;
	}

	$alt = get_post_meta( $meta_value, '_wp_attachment_id_to_image_alt', true );
	if ( ! $alt ) {
		return null;
	}

	return $alt;
}
