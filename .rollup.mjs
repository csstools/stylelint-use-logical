export default {
	input: 'index.js',
	output: [
		{ file: 'index.cjs', format: 'cjs', sourcemap: true },
		{ file: 'index.mjs', format: 'es', sourcemap: true }
	]
};
