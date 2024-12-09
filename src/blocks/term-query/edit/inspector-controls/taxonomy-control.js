import { ComboboxControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { useTaxonomies } from '../../utils';

export default function TaxonomyControl( { onChange, taxonomy } ) {
	const taxonomies = useTaxonomies();
	if ( ! taxonomies || taxonomies.length === 0 ) {
		return null;
	}

	return (
		<>
			<ComboboxControl
				__nextHasNoMarginBottom
				__next40pxDefaultSize
				label={ __( 'Taxonomy', 'term-query' ) }
				value={ taxonomy }
				onChange={ onChange }
				options={ taxonomies.map( ( { slug, name } ) => ( {
					value: slug,
					label: name,
				} ) ) }
			/>
		</>
	);
}
