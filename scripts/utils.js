/**
 * Script: utils.
 */

const { realpathSync } = require( 'fs' );
const { dirname, join } = require( 'path' );
const { cwd } = require( 'process' );
const { sync: readPkgUp } = require( 'read-pkg-up' );

const { packageJson, path: pkgPath } = readPkgUp( {
	cwd: realpathSync( cwd() ),
} );

/**
 * Get the absolute path to the package.json file.
 *
 * @returns {string} Path to package.json.
 */
const getPackagePath = () => pkgPath;

/**
 * Get the absolute path to a file from a relative path in the project root.
 *
 * @param {string} fileName File name.
 * @returns {string} Path to file.
 */
const fromProjectRoot = ( fileName ) =>
	join( dirname( getPackagePath() ), fileName );

/**
 * Get the contents of package.json.
 *
 * @return {Object} Contents of package.json.
 */
function getPackage() {
	return packageJson;
};

module.exports = {
	fromProjectRoot,
	getPackage,
	getPackagePath,
};
