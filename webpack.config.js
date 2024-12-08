/**
 * Custom webpack config for multiple blocks.
 */

const { basename, dirname, parse } = require( 'path' );
const glob = require( 'fast-glob' );

const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

module.exports = {
	...defaultConfig,
	entry() {
		// Get the default entries.
		const entries = (typeof defaultConfig.entry === 'function') ? defaultConfig.entry() : defaultConfig.entry;

		// Add entries dynamically for any scripts in the root of the src folder.
		const scripts = glob.sync( './src/*.js' );
		scripts.forEach( ( script ) => {
			const name = basename( script, '.js' );
			entries[ name ] = script;
		} );

		return entries;
	},
	optimization: {
		...( defaultConfig?.optimization || {} ),
		splitChunks: {
			...( defaultConfig?.optimization?.splitChunks || {} ),
			cacheGroups: {
				...( defaultConfig?.optimization?.splitChunks?.cacheGroups ||
					{} ),
				// Output individual CSS files with original filename.
				style: {
					type: 'css/mini-extract',
					test: /\.(sc|sa|c)ss$/,
					chunks: 'all',
					enforce: true,
					name( module, chunks, cacheGroupKey ) {
						const chunkName = dirname( chunks[ 0 ].name );
						const fileName = parse( module._identifier ).name;
						return `${ dirname( chunkName ) }/${ basename(
							chunkName
						) }/${ fileName }`;
					},
				},
				default: false,
			},
		},
	},
};
