/**
 * Block: term-template.
 */

import { registerBlockType } from '@wordpress/blocks';
import { layout as icon } from '@wordpress/icons';

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
