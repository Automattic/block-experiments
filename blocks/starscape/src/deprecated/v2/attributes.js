export default {
	align: {
		type: 'string',
		default: 'full',
	},
	color: {
		type: 'string',
		default: '#fff',
	},
	background: {
		type: 'string',
		// Default #000 in style.scss.
	},
	intensity: {
		type: 'number',
		default: 80,
	},
	density: {
		type: 'number',
		default: 20,
	},
	speed: {
		type: 'number',
		default: 20,
	},
	areaWidth: {
		type: 'integer',
		default: 1920,
	},
	areaHeight: {
		type: 'integer',
		default: 1080,
	},
	minHeight: {
		type: 'string',
		// Default 430px in style.scss.
	},
	layout: {
		type: 'object',
		default: {
			type: 'constrained',
		},
	},
	tagName: {
		type: 'string',
		default: 'div',
	},
	templateLock: {
		type: [ 'string', 'boolean' ],
		enum: [ 'all', 'insert', 'contentOnly', false ],
	},
	allowedBlocks: {
		type: 'array',
	},
};
