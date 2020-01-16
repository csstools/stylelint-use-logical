import stylelint from 'stylelint';
import ruleName from './rule-name';

export default stylelint.utils.ruleMessages(ruleName, {
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
