import {
	Flex,
	PanelBody,
	RangeControl,
	ToggleControl,
	Notice,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
} from '@wordpress/block-editor';

import OrderControl from './order-control';
import ParentControl from './parent-control';
import TaxonomyControl from './taxonomy-control';
import StickyTermsControl from './sticky-terms-control';
import PerPageControl from './per-page-control';
import PagesControl from './pages-control';
import {
	useAllowedControls,
	isControlAllowed,
	useTaxonomies,
} from '../../utils';

export default function QueryInspectorControls( props ) {
	const { attributes, setQuery, setDisplayLayout, setAttributes, context } =
		props;
	const {
		query,
		stickyTerms,
		displayLayout,
	} = attributes;
	const {
		taxonomy,
		order,
		orderBy,
		parent,
		hideEmpty,
		inherit = false,
	} = query;
	const {
		'term-query/termId': termId,
	} = context;
	const allowedControls = useAllowedControls( attributes );
	const taxonomies = useTaxonomies();

	const updateTaxonomy = ( value ) => {
		setQuery( { taxonomy: value } );
		setAttributes( { stickyTerms: [] } );
	};

	const isNested = !! termId;
	const isNestedOrInherited = isNested || inherit;

	const showInheritControl = ! isNested && isControlAllowed( allowedControls, 'inherit' );
	const showTaxControl =
		!! taxonomies?.length &&
		isControlAllowed( allowedControls, 'taxonomy' );
	const showParentControl = showTaxControl && isControlAllowed( allowedControls, 'parent' );
	const showColumnsControl = false;
	const showOrderControl =
		! inherit && isControlAllowed( allowedControls, 'order' );
	const showStickyTermsControl =
		! isNestedOrInherited &&
		showTaxControl &&
		isControlAllowed( allowedControls, 'stickyTerms' );
	const showSettingsPanel =
		isNested || // If nested, show to display inherited settings.
		showInheritControl ||
		showColumnsControl ||
		showOrderControl ||
		showStickyTermsControl;
	const showHideEmptyControl =
		showTaxControl &&
		isControlAllowed( allowedControls, 'hideEmpty' );

	const showPerPageControl = isControlAllowed( allowedControls, 'perPage' );
	const showPagesControl = false; // isControlAllowed( allowedControls, 'pages' ); // Not yet supported.

	const showDisplayPanel =
		showPerPageControl || showPagesControl;

	return (
		<>
			{ showSettingsPanel && (
				<InspectorControls>
					<PanelBody title={ __( 'Settings' ) }>
						{ showInheritControl && (
							<ToggleControl
								__nextHasNoMarginBottom
								label={ __( 'Inherit query from template' ) }
								help={ __(
									'Toggle to use the global query context that is set with the current template, such as the current post or term archive. Disable to customize the settings independently.',
									'term-query'
								) }
								checked={ !! inherit }
								onChange={ ( value ) =>
									setQuery( { inherit: !! value } )
								}
							/>
						) }
						{ isNested && (
							<p className="description">
								{ __(
									'This block is nested inside another term query block, so the taxonomy and parent term are inherited.',
									'term-query'
								) }
							</p>
						)}
						<Flex
							align="stretch"
							direction="column"
							gap={ 4 }
						>
							{ showTaxControl && (
								<TaxonomyControl
									onChange={ updateTaxonomy }
									taxonomy={ taxonomy }
									inherited={ inherit }
								/>
							) }
							{ showParentControl && (
								<ParentControl
									onChange={ ( value ) =>
										setQuery( { parent: value } )
									}
									parent={ parent }
									taxonomy={ taxonomy }
									inherited={ inherit }
								/>
							) }
							{ showStickyTermsControl && (
								<StickyTermsControl
									taxonomy={ taxonomy }
									stickyTerms={ stickyTerms }
									onChange={ ( value ) => {
										setAttributes( { stickyTerms: value } );
									} }
								/>
							) }
							{ showHideEmptyControl && (
								<ToggleControl
									__nextHasNoMarginBottom
									label={ __( 'Hide empty terms' ) }
									checked={ !! hideEmpty }
									onChange={ ( value ) =>
										setQuery( { hideEmpty: !! value } )
									}
								/>
							) }
							{ showColumnsControl && (
								<>
									<RangeControl
										__nextHasNoMarginBottom
										label={ __( 'Columns' ) }
										value={ displayLayout.columns }
										onChange={ ( value ) =>
											setDisplayLayout( {
												columns: value,
											} )
										}
										min={ 2 }
										max={ Math.max( 6, displayLayout.columns ) }
									/>
									{ displayLayout.columns > 6 && (
										<Notice
											status="warning"
											isDismissible={ false }
										>
											{ __(
												'This column count exceeds the recommended amount and may cause visual breakage.'
											) }
										</Notice>
									) }
								</>
							) }
							{ showOrderControl && (
								<OrderControl
									{ ...{ order, orderBy } }
									onChange={ setQuery }
								/>
							) }
						</Flex>
					</PanelBody>
					{ ! inherit && showDisplayPanel && (
						<PanelBody title={ __( 'Display' ) }>
							{ showPerPageControl && (
								<PerPageControl
									perPage={ query.perPage }
									onChange={ setQuery }
								/>
							) }
							{ showPagesControl && (
								<PagesControl
									pages={ query.pages }
									onChange={ setQuery }
								/>
							) }
						</PanelBody>
					) }
				</InspectorControls>
			) }
		</>
	);
}
