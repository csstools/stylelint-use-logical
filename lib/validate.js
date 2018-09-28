export const validateRuleWithProps = (root, props, fn) => {
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
