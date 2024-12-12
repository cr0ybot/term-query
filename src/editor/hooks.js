/**
 * Editor: hooks.
 */

import { createHooks } from '@wordpress/hooks';

if ( ! window.termQueryHooks ) {
	const termQueryHooks = createHooks();
	window.termQueryHooks = termQueryHooks;
}

export const {
	filters,
	addFilter,
	applyFilters,
	removeFilter,
	removeAllFilters,
	actions,
	addAction,
	doAction,
	removeAction,
	removeAllActions,
} = window.termQueryHooks;

export default window.termQueryHooks;
