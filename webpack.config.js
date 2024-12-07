/**
 * Custom webpack config for multiple blocks.
 */

const { basename, dirname, parse } = require( 'path' );

const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

module.exports = {
	...defaultConfig,
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
