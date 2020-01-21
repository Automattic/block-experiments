
const Save = ( { className, attributes } ) => {
	return (
		<div
			className={ className }
			data-complexity={ attributes.complexity }
			data-mouse-speed={ attributes.mouseSpeed }
			data-mouse-curls={ attributes.mouseCurls }
			data-fluid-speed={ attributes.fluidSpeed }
			data-color-intensity={ attributes.colorIntensity }
		/>
	);
};

export default Save;

