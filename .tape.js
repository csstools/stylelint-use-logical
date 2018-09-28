const stylelint = require('stylelint');
const { default: { rule }, ruleName } = require('.');
const skipBasicChecks = true;
let accept = [], reject = [];

[{
	message: 'WARN: "left: 0" throws 1 warning',
	sourceCSS: 'body { left: 0; }',
	options: 'always',
	warnings: 1,
}, {
	message: 'WARN: "left: 0" throws 0 warnings { except: [/^left$/i] }',
	sourceCSS: 'body { left: 0; }',
	options: ['always', { except: [/^left$/i] }],
	warnings: 0,
}, {
	message: 'WARN: "top: 0; left: 0" throws 1 warning',
	sourceCSS: 'body { top: 0; left: 0; }',
	options: 'always',
	warnings: 1
}, {
	message: 'WARN: "top: 0; margin-left: 0" throws 2 warnings',
	sourceCSS: 'body { top: 0; margin-left: 0; }',
	options: 'always',
	warnings: 2
}, {
	message: 'WARN: "top: 0; margin-left: 0" throws 2 warnings',
	sourceCSS: 'body { top: 0; margin-left: 0; }',
	options: ['always', { except: ['top', /^margin/] }],
	warnings: 0
}, {
	message: 'WARN: "padding-left: 0; margin-right: 0" throws 2 warnings',
	sourceCSS: 'body { padding-left: 0; margin-right: 0; }',
	options: 'always',
	warnings: 2,
}, {
	message: 'WARN: "clear: left" throws 1 warning',
	sourceCSS: 'body { clear: left; }',
	options: 'always',
	warnings: 1,
}, {
	message: 'WARN: "float: left" throws 1 warning',
	sourceCSS: 'body { float: left; }',
	options: 'always',
	warnings: 1,
}, {
	message: 'WARN: "text-align: left" throws 1 warning',
	sourceCSS: 'body { text-align: left; }',
	options: 'always',
	warnings: 1,
}, {
	message: 'FIX:  "left: 0" becomes "inset-inline-start: 0"',
	sourceCSS: 'body { left: 0; }',
	expectCSS: 'body { inset-inline-start: 0; }',
	options: 'always'
}, {
	message: 'FIX:  "left: 0; right: 0" becomes "inset-inline: 0"',
	sourceCSS: 'body { left: 0; right: 0; }',
	expectCSS: 'body { inset-inline: 0; }',
	options: 'always'
}, {
	message: 'FIX:  "left: 0; top: 0" becomes "inset-start: 0"',
	sourceCSS: 'body { left: 0; top: 0; }',
	expectCSS: 'body { inset-start: 0; }',
	options: 'always'
}, {
	message: 'FIX:  "bottom: 0; right: 0" becomes "inset-end: 0"',
	sourceCSS: 'body { bottom: 0; right: 0; }',
	expectCSS: 'body { inset-end: 0; }',
	options: 'always'
}, {
	message: 'FIX:  "top: 0; right: 0; bottom: 0; left: 0" becomes "inset: 0"',
	sourceCSS: 'body { top: 0; right: 0; bottom: 0; left: 0; }',
	expectCSS: 'body { inset: 0; }',
	options: 'always'
}, {
	message: 'FIX:  "margin-top: 0; margin-right: 0; margin-left: 0" becomes "margin-block-start: 0; margin-inline: 0"',
	sourceCSS: 'body { margin-top: 0; margin-right: 0; margin-left: 0; }',
	expectCSS: 'body { margin-block-start: 0; margin-inline: 0; }',
	options: 'always'
}, {
	message: 'FIX:  "clear: left" becomes "clear: inline-start"',
	sourceCSS: 'body { clear: left; }',
	expectCSS: 'body { clear: inline-start; }',
	options: 'always'
}, {
	message: 'FIX:  "float: right" becomes "float: inline-end"',
	sourceCSS: 'body { float: right; }',
	expectCSS: 'body { float: inline-end; }',
	options: 'always'
}, {
	message: 'FIX:  "text-align: left" becomes "text-align: start"',
	sourceCSS: 'body { text-align: start; }',
	options: 'always'
}, {
	message: 'FIX:  "float: left; text-align: left" becomes "float: left; text-align: start" { except: [/^float$/i] }',
	sourceCSS: 'body { float: left; text-align: start; }',
	options: ['always', {
		except: [/^float$/i]
	}]
}].reduce(
	(promise, schema) => promise.then(() => console.log(`- ${schema.message}`) || test(schema)),
	Promise.resolve()
).then(
	process.exit.bind(process, 0),
	error => console.error(`${error.message}`) || process.exit(1)
);

function test(config) {
	return stylelint.lint({
		code: config.sourceCSS,
		config: {
			plugins: ['.'],
			rules: {
				[ruleName]: config.options
			}
		},
		fix: Boolean(config.expectCSS)
	}).then(results => {
		const warnings = results.results.reduce(
			(array, result) => array.concat(result.warnings),
			[]
		);

		if (warnings.length) {
			if (typeof config.warnings === 'number' && config.warnings !== warnings.length) {
				throw new Error(`Expected ${config.warnings} warnings\nReceived ${warnings.length} warnings`);
			}
		}

		if (config.expectCSS && results.output !== config.expectCSS) {
			throw new Error(`Expected: ${config.expectCSS}\nRecieved: ${results.output}`);
		}
	});
}
