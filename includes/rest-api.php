<?php
/**
 * Include: rest-api.php
 *
 * Handles REST API customizations.
 *
 * @author    Cory Hughart <cory@coryhughart.com>
 * @copyright 2025 Cory Hughart
 * @license   https://www.gnu.org/licenses/gpl-3.0.html GPL-3.0-or-later
 * @link      https://github.com/cr0ybot/term-query
 * @package   term-query
 */

namespace cr0ybot\Term_Query\REST_API;

use WP_Taxonomy;

add_action( 'rest_api_init', __NAMESPACE__ . '\\filter_rest_taxonomy_collection_params' );

/**
 * Filter all REST-visible taxonomy collection params to allow the `term_order`
 * value for the `orderby` param.
 *
 * There is no general filter so we have to get a list of taxonomies and loop
 * through each one.
 */
function filter_rest_taxonomy_collection_params() {
	$taxonomies = get_taxonomies( array( 'show_in_rest' => true ) );

	foreach ( $taxonomies as $taxonomy ) {
		add_filter( "rest_{$taxonomy}_collection_params", __NAMESPACE__ . '\\add_term_order_to_orderby_enum', 10, 2 );
	}
}

/**
 * Add the `term_order` value to the `orderby` enum for a given taxonomy.
 *
 * @param array       $params The REST API params for the taxonomy.
 * @param WP_Taxonomy $taxonomy The taxonomy.
 * @return array The modified params.
 */
function add_term_order_to_orderby_enum( array $params, WP_Taxonomy $taxonomy ) {
	$params['orderby']['enum'][] = 'term_order';

	return $params;
}
