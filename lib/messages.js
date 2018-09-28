import stylelint from 'stylelint';
import ruleName from './rule-name';

export default stylelint.utils.ruleMessages(ruleName, {
	unexpectedProp(property, logicalProperty) {
		return `Unexpected ${property} property. Use ${logicalProperty}.`;
	},
	unexpectedValue(property, value, logicalValue) {
		return `Unexpected "${value}" value in ${property} property. Use "${logicalValue}".`;
	}
});
