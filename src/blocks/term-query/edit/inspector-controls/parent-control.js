import {
	ComboboxControl,
	TextControl,
} from '@wordpress/components';
import { useDebouncedInput } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';

import { useTerm, useTerms } from '../../../../queries/terms';

export const ParentControl = ( { parent = 0, taxonomy, onChange, inherited } ) => {
	const [ searchInput, setSearchInput, debouncedSearch ] = useDebouncedInput( '' );
	const {
		data: termsData,

	} = useTerms( {
		taxonomy,
		parent,
		...( debouncedSearch ? { search: debouncedSearch } : {} ),
	} );
	const {
		data: currentTerm = null,
	} = useTerm( taxonomy, parent );
	const terms = termsData?.pages?.flat() ?? [];

	console.log( { parent, currentTerm, terms } );

	const handleChange = ( value ) => {
		onChange( value ? parseInt( value ) : 0 );
	};

	if ( inherited ) {
		const label = currentTerm?.name ?? parent;

		return (
			<TextControl
				__nextHasNoMarginBottom
				__next40pxDefaultSize
				label={ __( 'Parent Term', 'term-query' ) }
				value={ label }
				disabled
			/>
		);
	}

	return (
		<ComboboxControl
			__nextHasNoMarginBottom
			__next40pxDefaultSize
			label={ __( 'Parent Term', 'term-query' ) }
			placeholder={ __( 'Search for a term', 'term-query' ) }
			value={ parent || null }
			onFilterValueChange={ setSearchInput }
			onChange={ handleChange }
			options={ terms?.map( ( { id, name } ) => ( {
				value: id,
				label: name,
			} ) ) }
		/>
	);
};

export default ParentControl;
