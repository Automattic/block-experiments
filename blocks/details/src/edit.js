/**
 * WordPress dependencies
 */
import {
	InnerBlocks,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import {
	ToggleControl,
	Panel,
	PanelBody,
	PanelRow,
} from '@wordpress/components';
import { useEffect, useRef } from '@wordpress/element';
import { SPACE } from '@wordpress/keycodes';

export default function DetalsEdit( {
	attributes,
	className,
	clientId,
	isSelected,
	setAttributes,
} ) {
	const summaryRef = useRef( null );

	const keyUpListener = ( e ) => {
		if ( e.keyCode === SPACE ) {
			e.preventDefault();
		}
	};

	const clickListener = ( e ) => e.preventDefault();

	useEffect( () => {
		if ( ! summaryRef.current ) {
			return;
		}

		summaryRef.current.addEventListener( 'keyup', keyUpListener );
		summaryRef.current.addEventListener( 'click', clickListener );
		return () => {
			summaryRef.current.removeEventListener( 'keyup', keyUpListener );
			summaryRef.current.removeEventListener( 'click', clickListener );
		};
	}, [ summaryRef.current ] );

	const isInnerBlockSelected = useSelect(
		( select ) =>
			select( 'core/block-editor' ).hasSelectedInnerBlock( clientId ),
		[ clientId ]
	);

	const showInnerBlocks =
		attributes.initialOpen || isSelected || isInnerBlockSelected;

	return (
		<>
			<InspectorControls>
				<Panel>
					<PanelBody>
						<PanelRow>
							<ToggleControl
								label={ __( 'Open by default' ) }
								onChange={ ( initialOpen ) =>
									setAttributes( { initialOpen } )
								}
								checked={ attributes.initialOpen }
							/>
						</PanelRow>
					</PanelBody>
				</Panel>
			</InspectorControls>
			<details className={ className } open={ showInnerBlocks }>
				<RichText
					tagName="summary"
					value={ attributes.summaryContent }
					onChange={ ( summaryContent ) =>
						setAttributes( { summaryContent } )
					}
					ref={ summaryRef }
					placeholder={ __( 'Write a summary…' ) }
					keepPlaceholderOnFocus
					aria-label={ __( 'Summary text' ) }
				/>
				<div className="wp-block-a8c-details__content">
					<InnerBlocks />
				</div>
			</details>
		</>
	);
}
