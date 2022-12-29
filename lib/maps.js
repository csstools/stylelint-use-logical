const inline = {
	start: { ltr: 'left', rtl: 'right' },
	end: { ltr: 'right', rtl: 'left' }
}

export const physical4Prop = [
	[ [ 'top', 'left', 'bottom', 'right' ], 'inset' ],
	[ [ 'margin-top', 'margin-left', 'margin-bottom', 'margin-right' ], 'margin' ],
	[ [ 'padding-top', 'padding-left', 'padding-bottom', 'padding-right' ], 'padding' ]
];

export const physical2Prop = () => [
	[ [ 'top', 'bottom' ], 'inset-block' ],
	[ [ 'left', 'right' ], 'inset-inline' ],

	[ [ 'margin-top', 'margin-bottom' ], 'margin-block' ],
	[ [ 'margin-left', 'margin-right' ], 'margin-inline' ],

	[ [ 'padding-top', 'padding-bottom' ], 'padding-block' ],
	[ [ 'padding-left', 'padding-right' ], 'padding-inline' ],
];

export const physicalProp = dir => [
	[ [ 'top' ], 'inset-block-start' ],
	[ [ 'bottom' ], 'inset-block-end' ],
	[ [ inline.start[dir] ], 'inset-inline-start' ],
	[ [ inline.end[dir] ], 'inset-inline-end' ],

	[ [ 'margin-top' ], 'margin-block-start' ],
	[ [ 'margin-bottom' ], 'margin-block-end' ],
	[ [ `margin-${inline.start[dir]}` ], 'margin-inline-start' ],
	[ [ `margin-${inline.end[dir]}` ], 'margin-inline-end' ],

	[ [ 'padding-top' ], 'padding-block-start' ],
	[ [ 'padding-bottom' ], 'padding-block-end' ],
	[ [ `padding-${inline.start[dir]}` ], 'padding-inline-start' ],
	[ [ `padding-${inline.end[dir]}` ], 'padding-inline-end' ],

	// width, height
	[ [ 'width' ], 'inline-size' ],
	[ [ 'min-width' ], 'min-inline-size' ],
	[ [ 'max-width' ], 'max-inline-size' ],
	[ [ 'height' ], 'block-size' ],
	[ [ 'min-height' ], 'min-block-size' ],
	[ [ 'max-height' ], 'max-block-size' ],

	// border
	[ [ 'border-top' ], 'border-block-start' ],
	[ [ 'border-bottom' ], 'border-block-end' ],
	[ [ `border-${inline.start[dir]}` ], 'border-inline-start' ],
	[ [ `border-${inline.end[dir]}` ], 'border-inline-end' ],

	[ [ 'border-top-color' ], 'border-block-start-color' ],
	[ [ 'border-top-style' ], 'border-block-start-style' ],
	[ [ 'border-top-width' ], 'border-block-start-width' ],
	[ [ 'border-bottom-color' ], 'border-block-end-color' ],
	[ [ 'border-bottom-style' ], 'border-block-end-style' ],
	[ [ 'border-bottom-width' ], 'border-block-end-width' ],


	[ [ `border-${inline.start[dir]}-color` ], 'border-inline-start-color' ],
	[ [ `border-${inline.start[dir]}-style` ], 'border-inline-start-style' ],
	[ [ `border-${inline.start[dir]}-width` ], 'border-inline-start-width' ],
	[ [ `border-${inline.end[dir]}-color` ], 'border-inline-end-color' ],
	[ [ `border-${inline.end[dir]}-style` ], 'border-inline-end-style' ],
	[ [ `border-${inline.end[dir]}-width` ], 'border-inline-end-width' ],



	[ [ `border-top-${inline.start[dir]}-radius` ], 'border-start-start-radius' ],
	[ [ `border-bottom-${inline.start[dir]}-radius` ], 'border-end-start-radius' ],
	[ [ `border-top-${inline.end[dir]}-radius` ], 'border-start-end-radius' ],
	[ [ `border-bottom-${inline.end[dir]}-radius` ], 'border-end-end-radius' ],

];

export const physicalValue = dir => [
	[ /^clear$/i, {
		[inline.start[dir]]: 'inline-start',
		[inline.end[dir]]: 'inline-end'
	}],
	[ /^float$/i, {
		[inline.start[dir]]: 'inline-start',
		[inline.end[dir]]: 'inline-end'
	}],
	[ /^text-align$/i, {
		[inline.start[dir]]: 'start',
		[inline.end[dir]]: 'end'
	}]
];
