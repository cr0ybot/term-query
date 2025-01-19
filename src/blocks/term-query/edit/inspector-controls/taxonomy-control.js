import {
	ComboboxControl,
	TextControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';

export default function TaxonomyControl( { taxonomies, onChange, taxonomy, inherited } ) {
	/**
	 * If the selected taxonomy is not in the list of taxonomies, clear the
	 * selected taxonomy. This might happen if the block variation is changed.
	 */
	useEffect(() => {
		if ( ! taxonomies ) {
			return;
		}

		if ( ! taxonomies.some( ( { slug } ) => slug === taxonomy ) ) {
			onChange( undefined );
		}
	}, [ taxonomies, taxonomy ]);

	if ( ! taxonomies || taxonomies.length === 0 ) {
		return null;
	}

	if ( inherited ) {
		const label = taxonomies.find( ( { slug } ) => slug === taxonomy )?.name ?? taxonomy;

		return (
			<TextControl
				__nextHasNoMarginBottom
				__next40pxDefaultSize
				label={ __( 'Taxonomy', 'term-query' ) }
				value={ label }
				disabled
			/>
		);
	}

	return (
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
	);
}
