'use strict';

var stylelint = require('stylelint');

const inline = {
	start: { ltr: 'left', rtl: 'right' },
	end: { ltr: 'right', rtl: 'left' }
};

const physical4Prop = [
	[ [ 'top', 'left', 'bottom', 'right' ], 'inset' ],
	[ [ 'margin-top', 'margin-left', 'margin-bottom', 'margin-right' ], 'margin' ],
	[ [ 'padding-top', 'padding-left', 'padding-bottom', 'padding-right' ], 'padding' ]
];

const physical2Prop = () => [
	[ [ 'top', 'bottom' ], 'inset-block' ],
	[ [ 'left', 'right' ], 'inset-inline' ],

	[ [ 'margin-top', 'margin-bottom' ], 'margin-block' ],
	[ [ 'margin-left', 'margin-right' ], 'margin-inline' ],

	[ [ 'padding-top', 'padding-bottom' ], 'padding-block' ],
	[ [ 'padding-left', 'padding-right' ], 'padding-inline' ],
];

const physicalProp = dir => [
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

const physicalValue = dir => [
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

const validateRuleWithProps = (root, props, fn) => {
	// conditionally walk nodes with children
	if (root.nodes && root.nodes.length) {
		const args = [];

		const hasProps = props.every(prop => {
			const declIndex = root.nodes.findIndex(child => child.type === 'decl' && child.prop === prop);
			const decl = root.nodes[declIndex];

			if (decl) {
				args.push(decl, declIndex);
			}

			return decl;
		});

		if (hasProps) {
			fn(...args);
		}
	}
};

var ruleName = 'csstools/use-logical';

var messages = stylelint.utils.ruleMessages(ruleName, {
	unexpectedProp(physicalProperty, logicalProperty) {
		return `Unexpected "${physicalProperty}" property. Use "${logicalProperty}".`;
	},
	unexpectedValue(property, physicalValue, logicalValue) {
		return `Unexpected "${physicalValue}" value in "${property}" property. Use "${logicalValue}".`;
	}
});

// walk all container nodes
function walk(node, fn) {
	if (node.nodes && node.nodes.length) {
		const nodes = node.nodes.slice();
		const length = nodes.length;
		let index = -1;

		while (++index < length) {
			const child = nodes[index];

			if (!isDirRule(child)) {
				fn(child);

				walk(child, fn);
			}
		}
	}
}

const dirSelectorRegExp = /:dir\(ltr|rtl\)/i;
const isDirRule = node => node.type === 'rule' && dirSelectorRegExp.test(node.selector);

const reportedDecls = new WeakMap();

function ruleFunc(method, opts, context) {
	const propExceptions = [].concat(Object(opts).except || []);
	const isAutofix = isContextAutofixing(context);
	const dir = /^rtl$/i.test(Object(opts).direction) ? 'rtl' : 'ltr';

	return (root, result) => {
		// validate the method
		const isMethodValid = stylelint.utils.validateOptions(result, ruleName, {
			actual: method,
			possible() {
				return isMethodIndifferent(method) ||
					isMethodAlways(method)
			}
		});

		const reportUnexpectedProperty = (decl, logicalProperty) => stylelint.utils.report({
			message: messages.unexpectedProp(decl.prop, logicalProperty),
			node: decl,
			result,
			ruleName
		});

		const reportUnexpectedValue = (node, value) => stylelint.utils.report({
			message: messages.unexpectedValue(node.prop, node.value, value),
			node,
			result,
			ruleName
		});

		if (isMethodValid && isMethodAlways(method)) {
			walk(root, node => {
				// validate or autofix 4 physical properties as logical shorthands
				physical4Prop.forEach(([ props, prop ]) => {
					validateRuleWithProps(node, props, (blockStartDecl, blockStartIndex, inlineStartDecl, inlineStartIndex, blockEndDecl, blockEndIndex, inlineEndDecl, inlineEndIndex) => { // eslint-disable-line
						if (
							isDeclAnException(blockStartDecl, propExceptions) ||
							isDeclAnException(inlineStartDecl, propExceptions) ||
							isDeclAnException(blockEndDecl, propExceptions) ||
							isDeclAnException(inlineEndDecl, propExceptions)
						) {
							return;
						}

						const firstInlineDecl = blockStartDecl;

						if (isAutofix) {
							const values = [ blockStartDecl.value, inlineStartDecl.value, blockEndDecl.value, inlineEndDecl.value ];

							if (values[1] === values[3]) {
								values.pop();

								if (values[2] === values[1]) {
									values.pop();

									if (values[1] === values[0]) {
										values.pop();
									}
								}
							}

							firstInlineDecl.cloneBefore({
								prop,
								value: values.length <= 2 ? values.join(' ') : `logical ${values.join(' ')}`
							});

							blockStartDecl.remove();
							inlineStartDecl.remove();
							blockEndDecl.remove();
							inlineEndDecl.remove();
						} else if (!isDeclReported(blockStartDecl) && !isDeclReported(inlineStartDecl) && !isDeclReported(blockEndDecl) && !isDeclReported(inlineEndDecl)) {
							reportUnexpectedProperty(firstInlineDecl, prop);

							reportedDecls.set(blockStartDecl);
							reportedDecls.set(inlineStartDecl);
							reportedDecls.set(blockEndDecl);
							reportedDecls.set(inlineEndDecl);
						}
					});
				});

				// validate or autofix 2 physical properties as logical shorthands
				physical2Prop().forEach(([ props, prop ]) => {
					validateRuleWithProps(node, props, (blockStartDecl, blockStartIndex, inlineStartDecl, inlineStartIndex) => { // eslint-disable-line
						if (
							isDeclAnException(blockStartDecl, propExceptions) ||
							isDeclAnException(inlineStartDecl, propExceptions)
						) {
							return;
						}

						const firstInlineDecl = blockStartIndex < inlineStartIndex
							? blockStartDecl
						: inlineStartDecl;

						if (isAutofix) {
							firstInlineDecl.cloneBefore({
								prop,
								value: blockStartDecl.value === inlineStartDecl.value
									? blockStartDecl.value
								: [ blockStartDecl.value, inlineStartDecl.value ].join(' ')
							});

							blockStartDecl.remove();
							inlineStartDecl.remove();
						} else if (!isDeclReported(blockStartDecl) && !isDeclReported(inlineStartDecl)) {
							reportUnexpectedProperty(firstInlineDecl, prop);

							reportedDecls.set(blockStartDecl);
							reportedDecls.set(inlineStartDecl);
						}
					});
				});

				// validate or autofix physical properties as logical
				physicalProp(dir).forEach(([ props, prop ]) => {
					validateRuleWithProps(node, props, physicalDecl => {
						if (isDeclAnException(physicalDecl, propExceptions)) {
							return;
						}

						if (isAutofix) {
							physicalDecl.prop = prop;
						} else if (!isDeclReported(physicalDecl)) {
							reportUnexpectedProperty(physicalDecl, prop);

							reportedDecls.set(physicalDecl);
						}
					});
				});

				// validate or autofix physical values as logical
				physicalValue(dir).forEach(([ regexp, props ]) => {
					if (!isNodeMatchingDecl(node, regexp)) {
						return;
					}

					if (isDeclAnException(node, propExceptions)) {
						return;
					}

					const valuekey = node.value.toLowerCase();

					if (valuekey in props) {
						const value = props[valuekey];

						if (isAutofix) {
							node.value = value;
						} else {
							reportUnexpectedValue(node, value);

							reportedDecls.set(node);
						}
					}
				});
			});
		}
	};
}ruleFunc.ruleName = ruleName;

var index = stylelint.createPlugin(ruleName, ruleFunc);

const isMethodIndifferent = method => method === 'ignore' || method === false || method === null;
const isMethodAlways = method => method === 'always' || method === true;
const isContextAutofixing = context => Boolean(Object(context).fix);
const isNodeMatchingDecl = (decl, regexp) => decl.type === 'decl' && regexp.test(decl.prop);

const isDeclAnException = (decl, propExceptions) => {
	if (!decl || decl.type !== 'decl') {
		return false;
	}

	return propExceptions.some((match) => {
		if (match instanceof RegExp) {
			return match.test(decl.prop);
		}

		return String(match || '').toLowerCase() === String(decl.prop || '').toLowerCase();
	});
};

const isDeclReported = decl => reportedDecls.has(decl);

module.exports = index;
//# sourceMappingURL=index.cjs.map
