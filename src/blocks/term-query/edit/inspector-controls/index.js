import {
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
import TaxonomyControl from './taxonomy-control';
import StickyTermsControl from './sticky-terms-control';
import {
	useAllowedControls,
	isControlAllowed,
	useTaxonomies,
} from '../../utils';

export default function QueryInspectorControls( props ) {
	const { attributes, setQuery, setDisplayLayout, setAttributes } =
		props;
	const { query, taxonomy, stickyTerms, displayLayout } = attributes;
	const {
		order,
		orderBy,
		hideEmpty,
		inherit,
	} = query;
	const allowedControls = useAllowedControls( attributes );
	const taxonomies = useTaxonomies();

	const updateTaxonomy = ( value ) => {
		setAttributes( { taxonomy: value, stickyTerms: [] } );
	};

	const showTaxControl =
		!! taxonomies?.length &&
		isControlAllowed( allowedControls, 'taxonomy' );
	const showInheritControl = isControlAllowed( allowedControls, 'inherit' );
	const showColumnsControl = false;
	const showOrderControl =
		! inherit && isControlAllowed( allowedControls, 'order' );
	const showStickyTermsControl =
		! inherit &&
		showTaxControl &&
		isControlAllowed( allowedControls, 'stickyTerms' );
	const showSettingsPanel =
		showInheritControl ||
		showColumnsControl ||
		showOrderControl ||
		showStickyTermsControl;
	const showHideEmptyControl =
		showTaxControl &&
		isControlAllowed( allowedControls, 'hideEmpty' );

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
						{ showTaxControl && (
							<TaxonomyControl
								onChange={ updateTaxonomy }
								taxonomy={ taxonomy }
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
					</PanelBody>
				</InspectorControls>
			) }
		</>
	);
}
