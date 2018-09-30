module.exports = {
	'csstools/use-logical': [{
		source: 'body { left: 0 }',
		args: 'always',
		warnings: 1,
	}, {
		source: 'body { left: 0 }',
		args: ['always', { except: 'left' }],
		warnings: 0,
	}, {
		source: 'body { top: 0; left: 0 }',
		args: 'always',
		warnings: 1
	}, {
		source: 'body { top: 0; margin-left: 0 }',
		args: 'always',
		warnings: [ 'Unexpected "top" property.', 'Unexpected "margin-left" property.' ]
	}, {
		source: 'body { top: 0; margin-left: 0 }',
		args: ['always', { except: ['top', /^margin/] }],
		warnings: 0
	}, {
		source: 'body { padding-left: 0; margin-right: 0 }',
		args: 'always',
		warnings: 2,
	}, {
		source: 'body { clear: left }',
		args: 'always',
		warnings: 1,
	}, {
		source: 'body { float: left }',
		args: 'always',
		warnings: 1,
	}, {
		source: 'body { text-align: left }',
		args: 'always',
		warnings: 1,
	}, {
		source: 'body:dir(ltr) { top: 0; margin-left: 0; float: left }',
		args: 'always',
		warnings: 0
	}, {
		source: 'body { left: 0 }',
		expect: 'body { inset-inline-start: 0 }',
		args: 'always'
	}, {
		source: 'body { left: 0; right: 0 }',
		expect: 'body { inset-inline: 0 }',
		args: 'always'
	}, {
		source: 'body { left: 0; top: 0 }',
		expect: 'body { inset-start: 0 }',
		args: 'always'
	}, {
		source: 'body { bottom: 0; right: 0 }',
		expect: 'body { inset-end: 0 }',
		args: 'always'
	}, {
		source: 'body { top: 0; right: 0; bottom: 0; left: 0 }',
		expect: 'body { inset: 0 }',
		args: 'always'
	}, {
		source: 'body { margin-top: 0; margin-right: 0; margin-left: 0 }',
		expect: 'body { margin-block-start: 0; margin-inline: 0 }',
		args: 'always'
	}, {
		source: 'body { clear: left }',
		expect: 'body { clear: inline-start }',
		args: 'always'
	}, {
		source: 'body { float: right }',
		expect: 'body { float: inline-end }',
		args: 'always'
	}, {
		source: 'body { text-align: left }',
		expect: 'body { text-align: start }',
		args: 'always'
	}, {
		source: 'body:dir(ltr) { text-align: left }',
		expect: 'body:dir(ltr) { text-align: left }',
		args: ['always']
	}, {
		source: 'body { float: left; text-align: left }',
		expect: 'body { float: left; text-align: start }',
		args: ['always', {
			except: [/^float$/i]
		}]
	}]
};
