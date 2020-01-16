const inline = {
	start: { ltr: 'left', rtl: 'right' },
	end: { ltr: 'right', rtl: 'left' }
}

const inlineValue = {
	left: { ltr: 'start', rtl: 'end' },
	right: { ltr: 'end', rtl: 'start' }
}

export const physical4Prop = [
	[['top', 'left', 'bottom', 'right'], 'inset'],
	[['margin-top', 'margin-left', 'margin-bottom', 'margin-right'], 'margin'],
	[['padding-top', 'padding-left', 'padding-bottom', 'padding-right'], 'padding']
];

export const physical2Prop = dir => [
	[['top', 'bottom'], 'inset-block'],
	[['left', 'right'], 'inset-inline'],
	[['top', inline.start[dir]], 'inset-start'],
	[['bottom', inline.end[dir]], 'inset-end'],

	[['margin-top', 'margin-bottom'], 'margin-block'],
	[['margin-left', 'margin-right'], 'margin-inline'],
	[['margin-top', `margin-${inline.start[dir]}`], 'margin-start'],
	[['margin-bottom', `margin-${inline.end[dir]}`], 'margin-end'],

	[['padding-top', 'padding-bottom'], 'padding-block'],
	[['padding-left', 'padding-right'], 'padding-inline'],
	[['padding-top', `padding-${inline.start[dir]}`], 'padding-start'],
	[['padding-bottom', `padding-${inline.end[dir]}`], 'padding-end']
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

export const physicalValueUnsupported = dir => [
	[/^clear$/i, {
		[inline.start[dir]]: 'inline-start',
		[inline.end[dir]]: 'inline-end'
	}],
	[/^float$/i, {
		[inline.start[dir]]: 'inline-start',
		[inline.end[dir]]: 'inline-end'
	}]
];

export const physicalValueSupported = dir => [
	[/^text-align$/i, {
		[inline.start[dir]]: 'start',
		[inline.end[dir]]: 'end'
	}]
];

export const physicalValueMixinReplacements = dir => [
    [['clear'], {
        [inlineValue.left[dir]]: `@include clear-inline-${inlineValue.left[dir]}()`,
		[inlineValue.right[dir]]: `@include clear-inline-${inlineValue.right[dir]}()`
	}],

    [['float'], {
        [inlineValue.left[dir]]: '@include float-inline-start()',
		[inlineValue.right[dir]]: '@include float-inline-end()'
	}]
]
