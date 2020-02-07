
const Save = ( { className, attributes, children } ) => {
	return (
		<div
			className={ className }
			data-complexity={ attributes.complexity }
			data-mouse-speed={ attributes.mouseSpeed }
			data-fluid-speed={ attributes.fluidSpeed }
			data-mode={ attributes.mode }
			data-image-url={ attributes.url }
			data-color1={ attributes.color1 }
			data-color2={ attributes.color2 }
			data-color3={ attributes.color3 }
			data-color4={ attributes.color4 }
		>{ children }</div>
	);
};

export default Save;

