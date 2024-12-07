/**
 * Block: terms.
 *
 * A WooCommerce categories block doesn't exist, so we might as well make a
 * general-purpose terms block.
 *
 * @see https://github.com/woocommerce/woocommerce/issues/42678
 */

import { registerBlockType } from '@wordpress/blocks';
import { loop as icon } from '@wordpress/icons';

import './style.scss';

import edit from './edit';
import save from './save';
import block from './block.json';

/**
 * Register block
 */
registerBlockType(block, {
	icon,
	edit,
	save,
});
