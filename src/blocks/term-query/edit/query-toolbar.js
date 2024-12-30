import {
	ToolbarGroup,
	ToolbarButton,
	Dropdown,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import PatternSelection, { useBlockPatterns } from './pattern-selection';

export default function QueryToolbar( { clientId, attributes } ) {
	const hasPatterns = useBlockPatterns( clientId, attributes ).length > 1;
	if ( ! hasPatterns ) {
		return null;
	}

	return (
		<ToolbarGroup className="wp-block-template-part__block-control-group">
			<Dropdown
				contentClassName="block-editor-block-settings-menu__popover"
				focusOnMount="firstElement"
				expandOnMobile
				renderToggle={ ( { isOpen, onToggle } ) => (
					<ToolbarButton
						aria-haspopup="true"
						aria-expanded={ isOpen }
						onClick={ onToggle }
					>
						{ __( 'Change design' ) }
					</ToolbarButton>
				) }
				renderContent={ () => (
					<PatternSelection
						clientId={ clientId }
						attributes={ attributes }
						showSearch={ false }
						showTitlesAsTooltip
					/>
				) }
			/>
		</ToolbarGroup>
	);
}
