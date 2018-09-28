import stylelint from 'stylelint';
import { physicalPropertiesMap, physicalShorthandPropertiesMap, physicalPropertyValuesMap, physicalShorthandLogicalPropertiesMap } from './lib/maps';
import { validateRuleWithProps } from './lib/validate';
import ruleName from './lib/rule-name';
import messages from './lib/messages';
import walk from './lib/walk';

const reportedDecls = new WeakMap();

export default stylelint.createPlugin(ruleName, (method, opts, context) => {
	const propExceptions = [].concat(Object(opts).except || []);
	const isAutofix = isContextAutofixing(context);

	return (root, result) => {
		// validate the method
		const isMethodValid = stylelint.utils.validateOptions(result, ruleName, {
			actual: method,
			possible() {
				return isMethodIndifferent(method) ||
					isMethodAlways(method)
			}
		});

		if (isMethodValid && isMethodAlways(method)) {
			walk(root, node => {
				// validate or autofix multiple physical properties
				physicalShorthandLogicalPropertiesMap.forEach(([props, prop]) => {
					validateRuleWithProps(node, props, (blockStartDecl, blockStartIndex, inlineStartDecl, inlineStartIndex, blockEndDecl, blockEndIndex, inlineEndDecl, inlineEndIndex) => { // eslint-disable-line
						const firstInlineDecl = blockStartDecl;

						if (isAutofix) {
							const values = [blockStartDecl.value, inlineStartDecl.value, blockEndDecl.value, inlineEndDecl.value];

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
							stylelint.utils.report({
								message: messages.unexpectedProp(firstInlineDecl.prop, prop),
								node: firstInlineDecl,
								result,
								ruleName
							});

							reportedDecls.set(blockStartDecl);
							reportedDecls.set(inlineStartDecl);
							reportedDecls.set(blockEndDecl);
							reportedDecls.set(inlineEndDecl);
						}
					});
				});

				// validate physical shorthand properties
				physicalShorthandPropertiesMap.forEach(([props, prop]) => {
					validateRuleWithProps(node, props, (blockStartDecl, blockStartIndex, inlineStartDecl, inlineStartIndex) => { // eslint-disable-line
						const firstInlineDecl = blockStartIndex < inlineStartIndex
							? blockStartDecl
						: inlineStartDecl;

						if (isAutofix) {
							firstInlineDecl.cloneBefore({
								prop,
								value: blockStartDecl.value === inlineStartDecl.value
									? blockStartDecl.value
								: [blockStartDecl.value, inlineStartDecl.value].join(' ')
							});

							blockStartDecl.remove();
							inlineStartDecl.remove();
						} else if (!isDeclReported(blockStartDecl) && !isDeclReported(inlineStartDecl)) {
							stylelint.utils.report({
								message: messages.unexpectedProp(firstInlineDecl.prop, prop),
								node: firstInlineDecl,
								result,
								ruleName
							});

							reportedDecls.set(blockStartDecl);
							reportedDecls.set(inlineStartDecl);
						}
					});
				});

				// validate or autofix physical properties (like left, margin-right, padding-bottom)
				physicalPropertiesMap.forEach(([props, prop]) => {
					validateRuleWithProps(node, props, physicalDecl => {
						if (!isDeclAnException(physicalDecl, propExceptions)) {
							if (isAutofix) {
								physicalDecl.prop = prop;
							} else if (!isDeclReported(physicalDecl)) {
								stylelint.utils.report({
									message: messages.unexpectedProp(physicalDecl.prop, prop),
									node: physicalDecl,
									result,
									ruleName
								});

								reportedDecls.set(physicalDecl);
							}
						}
					});
				});

				// validate physical property values
				physicalPropertyValuesMap.forEach(([regexp, props]) => {
					if (node.type === 'decl' && regexp.test(node.prop) && !isDeclAnException(node, propExceptions)) {
						const valuekey = node.value.toLowerCase();

						if (valuekey in props) {
							const value = props[valuekey];

							if (isAutofix) {
								node.value = value;
							} else {
								stylelint.utils.report({
									message: messages.unexpectedValue(node.prop, node.value, value),
									node,
									result,
									ruleName
								});

								reportedDecls.set(node);
							}
						}
					}
				});
			});
		}
	};
});

export { ruleName }

const isMethodIndifferent = method => method === 'ignore' || method === null || method === false;
const isMethodAlways = method => method === 'always' || method === true;
const isContextAutofixing = context => Boolean(Object(context).fix);
const isDeclAnException = (decl, propExceptions) => propExceptions.some(match => match instanceof RegExp
	? match.test(decl.prop)
: String(match || '').toLowerCase() === String(decl.prop || '').toLowerCase());
const isDeclReported = decl => reportedDecls.has(decl);
