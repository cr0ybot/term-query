
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import {
	store as blocksStore,
} from '@wordpress/blocks';
import {
	useBlockProps,
} from '@wordpress/block-editor';
import { Button, Placeholder, SelectControl, Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { useTaxonomies } from '../utils';

export default function QueryPlaceholder( {
	attributes,
	clientId,
	name,
	setAttributes,
} ) {
	const {
		taxonomy,
	} = attributes;
	const blockProps = useBlockProps();
	const taxonomies = useTaxonomies();
	const [ selectedTaxonomy, setSelectedTaxonomy ] = useState( taxonomy );

	const { blockType } = useSelect(
		( select ) => {
			const { getBlockType } = select( blocksStore );
			return {
				blockType: getBlockType( name ),
			};
		},
		[ name, clientId ]
	);

	const onSubmitTaxonomy = ( event ) => {
		event.preventDefault();

		if ( selectedTaxonomy ) {
			setAttributes( { taxonomy: selectedTaxonomy } );
		}
	};

	const icon = blockType?.icon?.src;

	return (
		<div { ...blockProps }>
			<Placeholder icon={ icon } label="Terms">
				<form
					onSubmit={ onSubmitTaxonomy }
					className="wp-block-feed-block-feed__placeholder-form"
				>
					{ ! taxonomies ? (
						<>
							<Spinner />
							<p>{ __( 'Loading taxonomies…', 'term-query' ) }</p>
						</>
					) : (
						<>
							<SelectControl
								label={ __( 'Select taxonomy', 'term-query' ) }
								value={ selectedTaxonomy }
								options={ [
									{
										value: '',
										label: __( 'Select a taxonomy', 'term-query' ),
									},
									...taxonomies?.map( ( { slug, name } ) => ( {
										value: slug,
										label: name,
									} ) ),
								]}
								onChange={ ( value ) => {
									setSelectedTaxonomy( value );
								} }
							/>
							<Button variant="primary" type="submit">
								{ __( 'Select taxonomy', 'term-query' ) }
							</Button>
						</>
					) }
				</form>
			</Placeholder>
		</div>
	);
}
