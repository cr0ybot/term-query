<?php
/**
 * Includes: woocommerce.php
 *
 * WooCommerce integration.
 *
 * @author    Cory Hughart <cory@coryhughart.com>
 * @copyright 2024 Cory Hughart
 * @license   https://www.gnu.org/licenses/gpl-3.0.html GPL-3.0-or-later
 * @link      https://github.com/cr0ybot/term-query
 * @package   term-query
 */

namespace cr0ybot\Term_Query\WooCommerce;

add_action( 'woocommerce_loaded', __NAMESPACE__ . '\\register_product_cat_meta' );

/**
 * Register product category term meta so that it is available in the REST API.
 */
function register_product_cat_meta() {
	// If the thumbnail_id meta key already exists, exit early.
	if ( registered_meta_key_exists( 'term', 'product_cat', 'thumbnail_id' ) ) {
		return;
	}

	register_term_meta(
		'product_cat',
		'thumbnail_id',
		array(
			'show_in_rest' => true,
			'single'       => true,
			'type'         => 'integer',
		)
	);
}
