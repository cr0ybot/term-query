/**
 * Script: version.
 *
 * Handles updating the version number in style.css when running `npm version`.
 */

const { getPackage} = require( './utils' );

/**
 * Get version from package.json.
 *
 * @returns {Promise<string>} The version number.
 */
function getPackageVersion() {
	const { version } = getPackage();
	return Promise.resolve( version );
}

/**
 * Update the version number in term-query.php.
 *
 * @param {string} version The new version number.
 */
async function setPluginVersion( version ) {
	return import( 'replace-in-file' )
	.then( ( { replaceInFile } ) => {
		const files = 'term-query.php';
		// Note that the part used to match the version is captured for the replacement as $1.
		const from = new RegExp(
			/^((\s*?\*\s*?)?Version:\s*)[^\r\n]+?$/,
			'm'
		);

		const options = {
			files,
			from,
			to: `$1${ version }`,
		};

		return replaceInFile( options );
	} );
}

getPackageVersion().then( ( version ) => {
	console.info( 'Updating plugin version to', version );
	setPluginVersion( version );
} );
