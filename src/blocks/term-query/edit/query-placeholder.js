
import { useSelect, useDispatch } from '@wordpress/data';
import {
	createBlocksFromInnerBlocksTemplate,
	store as blocksStore,
} from '@wordpress/blocks';
import { useState } from '@wordpress/element';
import {
	useBlockProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import {
	Button,
	Flex,
	FlexBlock,
	Placeholder,
	SelectControl,
	Spinner,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { useScopedBlockVariations, useTaxonomies } from '../utils';
import { useBlockPatterns } from './pattern-selection';

function TaxonomyPicker({ attributes, setAttributes }) {
	const { taxonomy } = attributes;
	const [ selectedTaxonomy, setSelectedTaxonomy ] = useState( taxonomy );
	const taxonomies = useTaxonomies();

	const onSubmitTaxonomy = ( event ) => {
		event.preventDefault();

		if ( selectedTaxonomy ) {
			setAttributes( { taxonomy: selectedTaxonomy } );
		}
	};

	return (
		<form
			onSubmit={ onSubmitTaxonomy }
			className="wp-block-cr0ybot-term-query__placeholder-form"
		>
			{ ! taxonomies ? (
				<>
					<Spinner />
					<p>{ __( 'Loading taxonomies…', 'term-query' ) }</p>
				</>
			) : (
				<Flex
					direction="column"
					align="stretch"
					style={{ width: '100%' }}
				>
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
					<FlexBlock>
						<Button variant="primary" type="submit" style={{ marginLeft: 'auto' }}>
							{ __( 'Select taxonomy', 'term-query' ) }
						</Button>
					</FlexBlock>
				</Flex>
			) }
		</form>
	);
}

function QueryVariationPicker( { clientId, attributes, openPatternSelectionModal } ) {
	const scopeVariations = useScopedBlockVariations( attributes );
	const { replaceInnerBlocks } = useDispatch( blockEditorStore );


	const handleSelectVariation = ( variation ) => {
		if ( variation.innerBlocks ) {
			replaceInnerBlocks(
				clientId,
				createBlocksFromInnerBlocksTemplate(
					variation.innerBlocks
				),
				false
			);
		}
	};

	return (
		<Flex
			direction="column"
			align="stretch"
		>
			{ /*
			 * Disable reason: The `list` ARIA role is redundant but
			 * Safari+VoiceOver won't announce the list otherwise.
			 */
			/* eslint-disable jsx-a11y/no-redundant-roles */ }
			<ul
				className="block-editor-block-variation-picker__variations"
				role="list"
				aria-label={ __( 'Block variations' ) }
			>
				{ scopeVariations.map( ( variation ) => (
					<li key={ variation.name }>
						<Button
							__next40pxDefaultSize
							variant="tertiary"
							icon={
								variation.icon && variation.icon.src
									? variation.icon.src
									: variation.icon
							}
							iconSize={ 48 }
							onClick={ () => handleSelectVariation( variation ) }
							className="block-editor-block-variation-picker__variation"
							label={ variation.description || variation.title }
						/>
						<span className="block-editor-block-variation-picker__variation-label">
							{ variation.title }
						</span>
					</li>
				) ) }
			</ul>
			{ !! openPatternSelectionModal && (
				<FlexBlock>
					<Button
						__next40pxDefaultSize
						variant="secondary"
						onClick={ openPatternSelectionModal }
						style={{ marginLeft: 'auto' }}
					>
						{ __( 'Choose a pattern instead', 'term-query' ) }
					</Button>
				</FlexBlock>
			) }
		</Flex>
	);
}

export default function QueryPlaceholder( {
	attributes,
	clientId,
	name,
	setAttributes,
	openPatternSelectionModal,
} ) {
	const {
		taxonomy,
	} = attributes;
	const [ isStartingBlank, setIsStartingBlank ] = useState( false );
	const blockProps = useBlockProps();
	const { blockType, activeBlockVariation } = useSelect(
		( select ) => {
			const { getActiveBlockVariation, getBlockType } = select( blocksStore );
			return {
				blockType: getBlockType( name ),
				activeBlockVariation: getActiveBlockVariation(
					name,
					attributes
				),
			};
		},
		[ name, attributes ]
	);
	const hasPatterns = !! useBlockPatterns( clientId, attributes ).length;
	const showPatternChoice = !! hasPatterns && ! isStartingBlank;
	const icon =
		activeBlockVariation?.icon?.src ||
		activeBlockVariation?.icon ||
		blockType?.icon?.src;
	const label = activeBlockVariation?.title || blockType?.title;
	const instructions = ! taxonomy ? __( 'Select a taxonomy to provide terms to display:', 'term-query' ) : ( showPatternChoice ? __( 'Choose a pattern or start blank:', 'term-query' ) : __( 'Choose a variation to start with:', 'term-query' ) );

	return (
		<div { ...blockProps }>
			<Placeholder
				icon={ icon }
				label={ label }
				instructions={ instructions }
			>
				{ ! taxonomy ? (
					<TaxonomyPicker
						attributes={ attributes }
						setAttributes={ setAttributes }
					/>
				) : (
					showPatternChoice ? (
						<>
							<Button
								__next40pxDefaultSize
								variant="primary"
								onClick={ openPatternSelectionModal }
							>
								{ __( 'Choose a pattern', 'term-query' ) }
							</Button>
							<Button
								__next40pxDefaultSize
								variant="secondary"
								onClick={ () => {
									setIsStartingBlank( true );
								} }
							>
								{ __( 'Start blank' ) }
							</Button>
						</>
					) : (
						<QueryVariationPicker
							clientId={ clientId }
							attributes={ attributes }
							openPatternSelectionModal={ openPatternSelectionModal }
						/>
					)
				)}
			</Placeholder>
		</div>
	);
}
