const inline = {
	start: { ltr: 'left', rtl: 'right' },
	end: { ltr: 'right', rtl: 'left' }
}

export const physical4Prop = [
	[['top', 'left', 'bottom', 'right'], 'inset'],
	[['margin-top', 'margin-left', 'margin-bottom', 'margin-right'], 'margin'],
	[['padding-top', 'padding-left', 'padding-bottom', 'padding-right'], 'padding']
];

export const physical2Prop = () => [
	[['top', 'bottom'], 'inset-block'],
	[['left', 'right'], 'inset-inline'],

	[['margin-top', 'margin-bottom'], 'margin-block'],
	[['margin-left', 'margin-right'], 'margin-inline'],

	[['padding-top', 'padding-bottom'], 'padding-block'],
	[['padding-left', 'padding-right'], 'padding-inline'],
];

export const physicalProp = dir => [
	[['top'], 'inset-block-start'],
	[['bottom'], 'inset-block-end'],
	[[inline.start[dir]], 'inset-inline-start'],
	[[inline.end[dir]], 'inset-inline-end'],

	[['margin-top'], 'margin-block-start'],
	[['margin-bottom'], 'margin-block-end'],
	[[`margin-${inline.start[dir]}`], 'margin-inline-start'],
	[[`margin-${inline.end[dir]}`], 'margin-inline-end'],

	[['padding-top'], 'padding-block-start'],
	[['padding-bottom'], 'padding-block-end'],
	[[`padding-${inline.start[dir]}`], 'padding-inline-start'],
	[[`padding-${inline.end[dir]}`], 'padding-inline-end']
];

export const physicalValue = dir => [
	[/^clear$/i, {
		[inline.start[dir]]: 'inline-start',
		[inline.end[dir]]: 'inline-end'
	}],
	[/^float$/i, {
		[inline.start[dir]]: 'inline-start',
		[inline.end[dir]]: 'inline-end'
	}],
	[/^text-align$/i, {
		[inline.start[dir]]: 'start',
		[inline.end[dir]]: 'end'
	}]
];
