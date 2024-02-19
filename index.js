import stylelint from 'stylelint';
import { physicalProp, physical2Prop, physical4Prop, physicalValue } from './lib/maps';
import { validateRuleWithProps } from './lib/validate';
import ruleName from './lib/rule-name';
import messages from './lib/messages';
import walk from './lib/walk';

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
						if (!isDeclAnException(physicalDecl, propExceptions)) {
							if (isAutofix) {
								physicalDecl.prop = prop;
							} else if (!isDeclReported(physicalDecl)) {
								reportUnexpectedProperty(physicalDecl, prop);

								reportedDecls.set(physicalDecl);
							}
						}
					});
				});

				// validate or autofix physical values as logical
				physicalValue(dir).forEach(([ regexp, props ]) => {
					if (isNodeMatchingDecl(node, regexp) && !isDeclAnException(node, propExceptions)) {
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
					}
				});
			});
		}
	};
};
ruleFunc.ruleName = ruleName;

export default stylelint.createPlugin(ruleName, ruleFunc);

const isMethodIndifferent = method => method === 'ignore' || method === false || method === null;
const isMethodAlways = method => method === 'always' || method === true;
const isContextAutofixing = context => Boolean(Object(context).fix);
const isNodeMatchingDecl = (decl, regexp) => decl.type === 'decl' && regexp.test(decl.prop);
const isDeclAnException = (decl, propExceptions) => propExceptions.some(match => match instanceof RegExp
	? match.test(decl.prop)
: String(match || '').toLowerCase() === String(decl.prop || '').toLowerCase());
const isDeclReported = decl => reportedDecls.has(decl);
