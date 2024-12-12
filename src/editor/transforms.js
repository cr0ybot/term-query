/**
 * Editor: transforms.
 */

import { addFilter } from './hooks';

/**
 * Transform to attachment URL.
 */
addFilter( 'termQuery.termMetaTransform.attachment_id_to_url', 'term-query/term-meta-transform/attachment_id_to_url', ( value, args, select ) => {
	// If value is not numeric, return early.
	if ( isNaN( value ) ) {
		return null;
	}

	const attachment = select( 'core' ).getMedia( value );
	if ( ! attachment ) {
		return null;
	}

	const size = args?.size ?? 'full';
	return attachment.media_details.sizes[ size ]?.source_url ?? attachment.source_url;
} );

/**
 * Transform to attachment image alt.
 */
addFilter( 'termQuery.termMetaTransform.attachment_id_to_image_alt', 'term-query/term-meta-transform/attachment_id_to_image_alt', ( value, args, select ) => {
	// If value is not numeric, return early.
	if ( isNaN( value ) ) {
		return null;
	}

	const attachment = select( 'core' ).getMedia( value );
	if ( ! attachment ) {
		return null;
	}

	return attachment.alt_text;
} );
