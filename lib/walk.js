// walk all container nodes
export default function walk(node, fn) {
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
