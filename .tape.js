module.exports = {
	'csstools/use-logical': [{
		source: 'body { left: 0 }',
		args: 'always',
		warnings: 1,
	}, {
		source: 'body { left: 0 }',
		args: [ 'always', { except: 'left' }],
		warnings: 0,
	}, {
		source: 'body { top: -4px; left: 0; }',
		args: 'always',
		warnings: 2,
	}, {
		source: 'body { top: -4px; left: 0; }',
		args: ['always', { except: 'top' }],
		warnings: 1,
	}, {
		source: 'body { top: -4px; left: 0; }',
		args: ['always', { except: 'left' }],
		warnings: 1,
	}, {
		source: 'body { top: -4px; left: 0; }',
		args: ['always', { except: ['top', 'left'] }],
		warnings: 0,
	}, {
		source: 'body { margin-top: 0.5rem; margin-bottom: 0.5rem; }',
		args: ['always', { except: ['margin-top'] }],
		warnings: 1,
	}, {
		source: 'body { margin-top: 0.5rem; margin-bottom: 0.5rem; }',
		args: ['always', { except: ['margin-top', 'margin-bottom'] }],
		warnings: 0,
	}, {
		source: 'body { top: 0; left: 0 }',
		args: 'always',
		warnings: 2
	}, {
		source: 'body { border-left: 0; left: 0 }',
		args: 'always',
		warnings: 2
	}, {
		source: 'body { top: 0; margin-left: 0 }',
		args: 'always',
		warnings: 2
	}, {
		source: 'body { top: 0; margin-left: 0 }',
		args: [ 'always', { except: [ 'top', /^margin/ ] }],
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
		source: 'body { top: 0; right: 0; bottom: 0; left: 0 }',
		expect: 'body { inset: 0 }',
		args: 'always'
	}, {
		source: 'body { margin-top: 0; margin-right: 0; margin-left: 0 }',
		expect: 'body { margin-block-start: 0; margin-inline: 0 }',
		args: 'always'
		}, {
			source: 'body { margin-left: 0; }',
			expect: 'body { margin-inline-start: 0; }',
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
		args: [ 'always' ]
	}, {
		source: 'body { float: left; text-align: left }',
		expect: 'body { float: left; text-align: start }',
		args: [ 'always', {
			except: [ /^float$/i ]
		}]
	}, {
		source: 'body { width: 0; }',
		expect: 'body { inline-size: 0; }',
		args: 'always'
	}, {
		source: 'body { min-width: 0; }',
		expect: 'body { min-inline-size: 0; }',
		args: 'always'
	}, {
		source: 'body { max-width: 0; }',
		expect: 'body { max-inline-size: 0; }',
		args: 'always'
	}, {
		source: 'body { height: 0; }',
		expect: 'body { block-size: 0; }',
		args: 'always'
	}, {
		source: 'body { min-height: 0; }',
		expect: 'body { min-block-size: 0; }',
		args: 'always'
	}, {
		source: 'body { max-height: 0; }',
		expect: 'body { max-block-size: 0; }',
		args: 'always'
	}, {
			source: 'body { border-left: 0; }',
			expect: 'body { border-inline-start: 0; }',
			args: 'always'
		}, {
			source: 'body { border-right: 0; }',
			expect: 'body { border-inline-end: 0; }',
			args: 'always'
		}, {
			source: 'body { border-top: 0; }',
			expect: 'body { border-block-start: 0; }',
			args: 'always'
		}, {
			source: 'body { border-bottom: 0; }',
			expect: 'body { border-block-end: 0; }',
			args: 'always'
		}, {
			source: 'body { border-left-color: 0; }',
			expect: 'body { border-inline-start-color: 0; }',
			args: 'always'
		}, {
			source: 'body { border-right-color: 0; }',
			expect: 'body { border-inline-end-color: 0; }',
			args: 'always'
		}, {
			source: 'body { border-top-color: 0; }',
			expect: 'body { border-block-start-color: 0; }',
			args: 'always'
		}, {
			source: 'body { border-bottom-color: 0; }',
			expect: 'body { border-block-end-color: 0; }',
			args: 'always'
		}, {
			source: 'body { border-left-style: 0; }',
			expect: 'body { border-inline-start-style: 0; }',
			args: 'always'
		}, {
			source: 'body { border-right-style: 0; }',
			expect: 'body { border-inline-end-style: 0; }',
			args: 'always'
		}, {
			source: 'body { border-top-style: 0; }',
			expect: 'body { border-block-start-style: 0; }',
			args: 'always'
		}, {
			source: 'body { border-bottom-style: 0; }',
			expect: 'body { border-block-end-style: 0; }',
			args: 'always'
		}, {
			source: 'body { border-left-width: 0; }',
			expect: 'body { border-inline-start-width: 0; }',
			args: 'always'
		}, {
			source: 'body { border-right-width: 0; }',
			expect: 'body { border-inline-end-width: 0; }',
			args: 'always'
		}, {
			source: 'body { border-top-width: 0; }',
			expect: 'body { border-block-start-width: 0; }',
			args: 'always'
		}, {
			source: 'body { border-bottom-width: 0; }',
			expect: 'body { border-block-end-width: 0; }',
			args: 'always'
		}, {
			source: 'body { border-top-left-radius: 0; }',
			expect: 'body { border-start-start-radius: 0; }',
			args: 'always'
		}, {
			source: 'body { border-top-right-radius: 0; }',
			expect: 'body { border-start-end-radius: 0; }',
			args: 'always'
		}, {
			source: 'body { border-bottom-left-radius: 0; }',
			expect: 'body { border-end-start-radius: 0; }',
			args: 'always'
		}, {
			source: 'body { border-bottom-right-radius: 0; }',
			expect: 'body { border-end-end-radius: 0; }',
			args: 'always'
		}
	]
};
