<?php
/**
 * Include: enqueue.php
 *
 * Enqueues scripts and styles.
 *
 * @author    Cory Hughart <cory@coryhughart.com>
 * @copyright 2024 Cory Hughart
 * @license   https://www.gnu.org/licenses/gpl-3.0.html GPL-3.0-or-later
 * @link      https://github.com/cr0ybot/term-query
 * @package   term-query
 */

namespace cr0ybot\Term_Query\Enqueue;

add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\\enqueue_block_editor_assets' );

/**
 * Enqueue block editor assets.
 */
function enqueue_block_editor_assets() {
	$asset_file = include TERM_QUERY_DIST_PATH . 'editor.asset.php';

	wp_enqueue_script(
		'term-query-editor',
		TERM_QUERY_DIST_URI . 'editor.js',
		$asset_file['dependencies'],
		$asset_file['version'],
		true
	);
}
