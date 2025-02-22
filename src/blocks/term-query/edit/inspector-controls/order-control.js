/**
 * WordPress dependencies
 */
import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const orderOptions = [
	{
		/* translators: Label for ordering posts by title in ascending order. */
		label: __( 'A → Z' ),
		value: 'name/asc',
	},
	{
		/* translators: Label for ordering posts by title in descending order. */
		label: __( 'Z → A' ),
		value: 'name/desc',
	},
	{
		label: __( 'Manual Term Order' ),
		value: 'term_order/asc',
	},
	{
		label: __( 'Most used' ),
		value: 'count/desc',
	},
	{
		label: __( 'Least used' ),
		value: 'count/asc',
	},
	{
		label: __( 'Newest to oldest' ),
		value: 'id/desc',
	},
	{
		label: __( 'Oldest to newest' ),
		value: 'id/asc',
	},
];

export default function OrderControl( { order, orderBy, onChange } ) {
	return (
		<SelectControl
			__nextHasNoMarginBottom
			__next40pxDefaultSize
			label={ __( 'Order by' ) }
			value={ `${ orderBy }/${ order }` }
			options={ orderOptions }
			onChange={ ( value ) => {
				const [ newOrderBy, newOrder ] = value.split( '/' );
				onChange( { order: newOrder, orderBy: newOrderBy } );
			} }
		/>
	);
}
