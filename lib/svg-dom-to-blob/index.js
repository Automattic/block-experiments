
export default function svgDomToBlob( svgNode, fn ) {
	if ( ! svgNode ) {
		return;
	}

	// Get SVG Blob.
	const svgString = new XMLSerializer().serializeToString( svgNode );
	const DOMURL = self.URL || self.webkitURL || self;
	const svgBlob = new Blob( [ svgString ], { type: "image/svg+xml;charset=utf-8" } );

	// Start to convert SVG string to base64.
	const canvas = document.createElement( 'canvas' );
	const ctx = canvas.getContext( "2d" );
	ctx.canvas.width = svgNode.width.baseVal.value;
	ctx.canvas.height = svgNode.height.baseVal.value;

	// Create an image based on the SVG string.
	const img = new Image();
	const url = DOMURL.createObjectURL( svgBlob );
	img.onload = function() {
		// Draw the image on the canvas.
		ctx.drawImage( img, 0, 0 );
		DOMURL.revokeObjectURL( canvas.toDataURL( 'image/png' ) );
		canvas.toBlob( fn );
	};
	img.src = url;
};
