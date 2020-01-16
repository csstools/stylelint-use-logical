'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var stylelint = _interopDefault(require('stylelint'));

const inline = {
  start: {
    ltr: 'left',
    rtl: 'right'
  },
  end: {
    ltr: 'right',
    rtl: 'left'
  }
};
const physical4Prop = [[['top', 'left', 'bottom', 'right'], 'inset'], [['margin-top', 'margin-left', 'margin-bottom', 'margin-right'], 'margin'], [['padding-top', 'padding-left', 'padding-bottom', 'padding-right'], 'padding']];
const physical2Prop = dir => [[['top', 'bottom'], 'inset-block'], [['left', 'right'], 'inset-inline'], [['top', inline.start[dir]], 'inset-start'], [['bottom', inline.end[dir]], 'inset-end'], [['margin-top', 'margin-bottom'], 'margin-block'], [['margin-left', 'margin-right'], 'margin-inline'], [['margin-top', `margin-${inline.start[dir]}`], 'margin-start'], [['margin-bottom', `margin-${inline.end[dir]}`], 'margin-end'], [['padding-top', 'padding-bottom'], 'padding-block'], [['padding-left', 'padding-right'], 'padding-inline'], [['padding-top', `padding-${inline.start[dir]}`], 'padding-start'], [['padding-bottom', `padding-${inline.end[dir]}`], 'padding-end']];
const physicalProp = dir => [[['top'], 'inset-block-start'], [['bottom'], 'inset-block-end'], [[inline.start[dir]], 'inset-inline-start'], [[inline.end[dir]], 'inset-inline-end'], [['margin-top'], 'margin-block-start'], [['margin-bottom'], 'margin-block-end'], [[`margin-${inline.start[dir]}`], 'margin-inline-start'], [[`margin-${inline.end[dir]}`], 'margin-inline-end'], [['padding-top'], 'padding-block-start'], [['padding-bottom'], 'padding-block-end'], [[`padding-${inline.start[dir]}`], 'padding-inline-start'], [[`padding-${inline.end[dir]}`], 'padding-inline-end']];
const physicalValueUnsupported = dir => [[/^clear$/i, {
  [inline.start[dir]]: 'inline-start',
  [inline.end[dir]]: 'inline-end'
}], [/^float$/i, {
  [inline.start[dir]]: 'inline-start',
  [inline.end[dir]]: 'inline-end'
}]];
const physicalValueSupported = dir => [[/^text-align$/i, {
  [inline.start[dir]]: 'start',
  [inline.end[dir]]: 'end'
}]];

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
  },

  unexpectedValueMixin(property, physicalValue) {
    return `Unexpected "${physicalValue}" value in "${property}" property. Use mixin from _direction.scss.`;
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
var index = stylelint.createPlugin(ruleName, (method, opts, context) => {
  const propExceptions = [].concat(Object(opts).except || []);
  const isProp2ConversionEnabled = !isProp2Disabled(opts);
  const isProp4ConversionEnabled = !isProp4Disabled(opts);
  const isAutofix = isContextAutofixing(context);
  const dir = /^rtl$/i.test(Object(opts).direction) ? 'rtl' : 'ltr';
  return (root, result) => {
    // validate the method
    const isMethodValid = stylelint.utils.validateOptions(result, ruleName, {
      actual: method,

      possible() {
        return isMethodIndifferent(method) || isMethodAlways(method);
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

    const reportUnexpectedValueMixin = (node, value) => stylelint.utils.report({
      message: messages.unexpectedValueMixin(node.prop, node.value, value),
      node,
      result,
      ruleName
    });

    const validateOrAutofixPhysicalValuesAsLogical = (node, physValMap, reportFn) => physValMap(dir).forEach(([regexp, props]) => {
      if (isNodeMatchingDecl(node, regexp) && !isDeclAnException(node, propExceptions)) {
        const valuekey = node.value.toLowerCase();

        if (valuekey in props) {
          const value = props[valuekey];

          if (isAutofix) {
            node.value = value;
          } else {
            reportFn(node, value);
            reportedDecls.set(node);
          }
        }
      }
    });

    if (isMethodValid && isMethodAlways(method)) {
      walk(root, node => {
        // validate or autofix 4 physical properties as logical shorthands
        if (isProp4ConversionEnabled) {
          physical4Prop.filter(([physProps, logicalProp]) => {
            // eslint-disable-line
            return !physProps.some(physProp => propExceptions.includes(physProp));
          }).forEach(([props, prop]) => {
            validateRuleWithProps(node, props, (blockStartDecl, blockStartIndex, inlineStartDecl, inlineStartIndex, blockEndDecl, blockEndIndex, inlineEndDecl, inlineEndIndex) => {
              // eslint-disable-line
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
                reportUnexpectedProperty(firstInlineDecl, prop);
                reportedDecls.set(blockStartDecl);
                reportedDecls.set(inlineStartDecl);
                reportedDecls.set(blockEndDecl);
                reportedDecls.set(inlineEndDecl);
              }
            });
          });
        } // validate or autofix 2 physical properties as logical shorthands


        if (isProp2ConversionEnabled) {
          physical2Prop(dir).filter(([physProps, logicalProp]) => {
            // eslint-disable-line
            return !physProps.some(physProp => propExceptions.includes(physProp));
          }).forEach(([props, prop]) => {
            validateRuleWithProps(node, props, (blockStartDecl, blockStartIndex, inlineStartDecl, inlineStartIndex) => {
              // eslint-disable-line
              const firstInlineDecl = blockStartIndex < inlineStartIndex ? blockStartDecl : inlineStartDecl;

              if (isAutofix) {
                firstInlineDecl.cloneBefore({
                  prop,
                  value: blockStartDecl.value === inlineStartDecl.value ? blockStartDecl.value : [blockStartDecl.value, inlineStartDecl.value].join(' ')
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
        } // validate or autofix physical properties as logical


        physicalProp(dir).forEach(([props, prop]) => {
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
        }); // validate or autofix physical values as logical

        validateOrAutofixPhysicalValuesAsLogical(node, physicalValueSupported, reportUnexpectedValue);
        validateOrAutofixPhysicalValuesAsLogical(node, physicalValueUnsupported, reportUnexpectedValueMixin);
      });
    }
  };
});

const isMethodIndifferent = method => method === 'ignore' || method === false || method === null;

const isMethodAlways = method => method === 'always' || method === true;

const isContextAutofixing = context => Boolean(Object(context).fix);

const isProp2Disabled = opts => Boolean(Object(opts).disableProp2);

const isProp4Disabled = opts => Boolean(Object(opts).disableProp4);

const isNodeMatchingDecl = (decl, regexp) => decl.type === 'decl' && regexp.test(decl.prop);

const isDeclAnException = (decl, propExceptions) => propExceptions.some(match => match instanceof RegExp ? match.test(decl.prop) : String(match || '').toLowerCase() === String(decl.prop || '').toLowerCase());

const isDeclReported = decl => reportedDecls.has(decl);

exports.default = index;
exports.ruleName = ruleName;
//# sourceMappingURL=index.cjs.js.map
