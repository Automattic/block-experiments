
const Save = ( { className, attributes } ) => {
	return (
		<div
			className={ className }
			data-complexity={ attributes.complexity }
			data-mouse-speed={ attributes.mouseSpeed }
			data-fluid-speed={ attributes.fluidSpeed }
			data-color1={ attributes.color1 }
			data-color2={ attributes.color2 }
			data-color3={ attributes.color3 }
			data-color4={ attributes.color4 }
		/>
	);
};

export default Save;

