const Save = ( { attributes, className } ) => {
	return (
		<figure className={ className }>
			{ attributes.content }
		</figure>
	);
};

export default Save;
