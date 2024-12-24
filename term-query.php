<?php
/**
 * Plugin Name:       Term Query Loop Block
 * Plugin URI:        https://github.com/cr0ybot/term-query
 * Description:       Query and display taxonomy terms as blocks.
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Version:           0.5.0
 * Author:            Cory Hughart
 * Author URI:        https://coryhughart.com
 * License:           GPL-3.0-or-later
 * License URI:       (https://www.gnu.org/licenses/gpl-3.0.html)
 * Text Domain:       term-query
 * GitHub Plugin URI: https://github.com/cr0ybot/term-query
 * Primary Branch:    main
 * Release Asset:     true
 *
 * @package term-query
 */

namespace cr0ybot\Term_Query;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

define( 'TERM_QUERY_PLUGIN_PATH', trailingslashit( plugin_dir_path( __FILE__ ) ) );
define( 'TERM_QUERY_PLUGIN_URI', trailingslashit( plugin_dir_url( __FILE__ ) ) );
define( 'TERM_QUERY_DIST_PATH', TERM_QUERY_PLUGIN_PATH . 'build/' );
define( 'TERM_QUERY_DIST_URI', TERM_QUERY_PLUGIN_URI . 'build/' );
define( 'TERM_QUERY_BLOCKS_PATH', TERM_QUERY_DIST_PATH . 'blocks/' );

// Glob import all includes.
foreach ( glob( plugin_dir_path( __FILE__ ) . 'includes/*.php' ) as $file ) {
	require_once $file;
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function register_blocks() {
	// Extra args for specific blocks.
	$block_args = array(
		'term-template' => array(
			'skip_inner_blocks' => true,
		),
	);

	foreach ( glob( plugin_dir_path( __FILE__ ) . 'build/blocks/*', GLOB_ONLYDIR ) as $block_dir ) {
		$args = array();
		if ( isset( $block_args[ basename( $block_dir ) ] ) ) {
			$args = $block_args[ basename( $block_dir ) ];
		}
		register_block_type( $block_dir, $args );
	}
}
add_action( 'init', __NAMESPACE__ . '\\register_blocks' );
