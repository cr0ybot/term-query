/**
 * Helper function that returns the query context from the editor based on the
 * available template slug.
 *
 * @param {string} templateSlug Current template slug based on context.
 * @return {Object} An object with isSingular and templateType properties.
 */
export function getQueryContextFromTemplate( templateSlug ) {
	// In the Post Editor, the template slug is not available.
	if ( ! templateSlug ) {
		return { isSingular: true };
	}
	let isSingular = false;
	let templateType = templateSlug === 'wp' ? 'custom' : templateSlug;
	const singularTemplates = [ '404', 'blank', 'single', 'page', 'custom' ];
	const templateTypeFromSlug = templateSlug.includes( '-' )
		? templateSlug.split( '-', 1 )[ 0 ]
		: templateSlug;
	const queryFromTemplateSlug = templateSlug.includes( '-' )
		? templateSlug.split( '-' ).slice( 1 ).join( '-' )
		: '';
	if ( queryFromTemplateSlug ) {
		templateType = templateTypeFromSlug;
	}
	isSingular = singularTemplates.includes( templateType );

	return { isSingular, templateType };
}
