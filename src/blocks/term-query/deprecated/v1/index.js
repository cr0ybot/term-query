/**
 * Deprecated: v1
 *
 * Migrate the taxonomy attribute to the query attribute object.
 */

import { useInnerBlocksProps, useBlockProps } from '@wordpress/block-editor';

export default {
	attributes: {
		"queryId": {
			"type": "number"
		},
		"query": {
			"type": "object",
			"default": {
				"perPage": 100,
				"pages": 0,
				"offset": 0,
				"order": "asc",
				"orderBy": "name",
				"hideEmpty": true,
				"include": [],
				"exclude": [],
				"inherit": false,
				"parent": 0
			}
		},
		"taxonomy": {
			"type": "string"
		},
		"stickyTerms": {
			"type": "array",
			"default": []
		},
		"tagName": {
			"type": "string",
			"default": "div"
		},
		"namespace": {
			"type": "string"
		},
		"previewTaxonomy": {
			"type": "string"
		}
	},
	isEligible( attributes ) {
		// If the taxonomy attribute is present, we need to migrate it.
		return !! attributes?.taxonomy;
	},
	migrate( attributes ) {
		return {
			...((({ taxonomy, ...atts }) => atts )(attributes)),
			query: {
				...attributes.query,
				taxonomy: attributes.taxonomy,
			},
		};
	},
	save( { attributes: { tagName: Tag = 'div' } } ) {
		const blockProps = useBlockProps.save();
		const innerBlocksProps = useInnerBlocksProps.save( blockProps );
		return <Tag { ...innerBlocksProps } />;
	},
};
