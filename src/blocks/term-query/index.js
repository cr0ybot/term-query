/**
 * Block: terms.
 *
 * A WooCommerce categories block doesn't exist, so we might as well make a
 * general-purpose terms block.
 *
 * @see https://github.com/woocommerce/woocommerce/issues/42678
 */

import { registerBlockType } from '@wordpress/blocks';

import './style.scss';

import block from './block.json';
import icon from './icon';
import edit from './edit';
import save from './save';
import variations from './variations';

/**
 * Register block
 */
registerBlockType(block, {
	icon,
	edit,
	save,
	variations,
});
