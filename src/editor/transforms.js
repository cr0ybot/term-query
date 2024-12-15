/**
 * Editor: transforms.
 */

import { addFilter } from './hooks';

addFilter( 'termQuery.termMetaTransform.attachment_id_to_url', 'term-query/term-meta-transform/attachment_id_to_url', attachment_id_to_url );
addFilter( 'termQuery.termMetaTransform.attachment_id_to_image_alt', 'term-query/term-meta-transform/attachment_id_to_image_alt', attachment_id_to_image_alt );

/**
 * Transform to attachment URL.
 *
 * @param {number} value Attachment ID.
 * @param {Object} args Arguments.
 * @param {Function} select Select function.
 * @return {string} Attachment URL or empty string.
 */
const attachment_id_to_url = ( value, args, select ) => {
	// If value is not numeric, return early.
	if ( isNaN( value ) ) {
		return '';
	}

	const attachment = select( 'core' ).getMedia( value );
	if ( ! attachment ) {
		return '';
	}

	const size = args?.size ?? 'full';
	return attachment.media_details.sizes[ size ]?.source_url ?? attachment.source_url;
};

/**
 * Transform to attachment image alt.
 *
 * @param {number} value Attachment ID.
 * @param {Object} args Arguments.
 * @param {Function} select Select function.
 * @return {string} Attachment image alt or empty string.
 */
const attachment_id_to_image_alt = ( value, args, select ) => {
	// If value is not numeric, return early.
	if ( isNaN( value ) ) {
		return '';
	}

	const attachment = select( 'core' ).getMedia( value );
	if ( ! attachment ) {
		return '';
	}

	return attachment.alt_text;
};
