export const physicalShorthandLogicalPropertiesMap = [
	[['top', 'left', 'bottom', 'right'], 'inset'],
	[['margin-top', 'margin-left', 'margin-bottom', 'margin-right'], 'margin'],
	[['padding-top', 'padding-left', 'padding-bottom', 'padding-right'], 'padding']
];

export const physicalShorthandPropertiesMap = [
	[['top', 'bottom'], 'inset-block'],
	[['left', 'right'], 'inset-inline'],
	[['top', 'left'], 'inset-start'],
	[['bottom', 'right'], 'inset-end'],

	[['margin-top', 'margin-bottom'], 'margin-block'],
	[['margin-left', 'margin-right'], 'margin-inline'],
	[['margin-top', 'margin-left'], 'margin-start'],
	[['margin-bottom', 'margin-right'], 'margin-end'],

	[['padding-top', 'padding-bottom'], 'padding-block'],
	[['padding-left', 'padding-right'], 'padding-inline'],
	[['padding-top', 'padding-left'], 'padding-start'],
	[['padding-bottom', 'padding-right'], 'padding-end']
];

export const physicalPropertiesMap = [
	[['top'], 'inset-block-start'],
	[['right'], 'inset-inline-end'],
	[['bottom'], 'inset-block-end'],
	[['left'], 'inset-inline-start'],

	[['margin-top'], 'margin-block-start'],
	[['margin-right'], 'margin-inline-end'],
	[['margin-bottom'], 'margin-block-end'],
	[['margin-left'], 'margin-inline-start'],

	[['padding-top'], 'padding-block-start'],
	[['padding-right'], 'padding-inline-end'],
	[['padding-bottom'], 'padding-block-end'],
	[['padding-left'], 'padding-inline-start']
];

export const physicalPropertyValuesMap = [
	[/^clear$/i, { left: 'inline-start', right: 'inline-end' }],
	[/^float$/i, { left: 'inline-start', right: 'inline-end' }],
	[/^text-align$/i, { left: 'start', right: 'end' }]
];
