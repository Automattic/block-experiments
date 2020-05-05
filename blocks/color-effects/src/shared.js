export const getFallbackStyle = ( { color1, color2, color3, color4 } ) => ( {
	backgroundBlendMode: 'screen',
	background: `linear-gradient( 45deg, ${ color1 }, rgba( 0, 0, 0, 0 ) 81.11% ),
linear-gradient( 135deg, ${ color2 }, rgba( 0, 0, 0, 0 ) 81.11% ),
linear-gradient( 225deg, ${ color3 }, rgba( 0, 0, 0, 0 ) 81.11% ),
linear-gradient( 315deg, ${ color4 }, rgba( 0, 0, 0, 0 ) 81.11% ),
#000`,
} );
