# Property Use Logical [<img src="https://jonathantneal.github.io/stylelint-logo.svg" alt="stylelint" width="90" height="90" align="right">][stylelint]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Support Chat][git-img]][git-url]

[Property Use Logical] is a [stylelint] rule to enforce usage of
logical properties and values in CSS.

## Usage

Add [stylelint] and [Property Use Logical] to your project.

```bash
npm install stylelint stylelint-use-logical --save-dev
```

Add [Property Use Logical] to your [stylelint configuration].

```js
{
  "plugins": [
    "stylelint-use-logical"
  ],
  "rules": {
    "csstools/stylelint-use-logical": "always" || "never" || "ignore"
  }
}
```

## Options

### always

If the first option is `"always"` or `true`, then [Property Use Logical]
requires logical properties to be used when available, and the following
patterns are _not_ considered violations:

```pcss
.inset-example {
  inset: 0;
}

.margin-example {
  margin-inline-start: 0;
}

.padding-example {
  padding-inline: 0;
}

.float-example {
  float: inline-start;
}

.float-example {
  float: inline-start;
}

.text-align-example {
  text-align: start;
}
```

While the following patterns are considered violations:

```pcss
.inset-example {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.margin-example {
  margin-left: 0;
}

.padding-example {
  padding-right: 0;
}

.float-example {
  float: left;
}

.text-align-example {
  text-align: left;
}
```

### ignore

If the first option is `"ignore"` or `null`, then [Property Use Logical] does
nothing.

---

### except

If the first option is `"always"` or `true`, then the second option can include
an `except` property which instructs [Property Use Logical] to ignore
certain properties. Those ignore statements

```js
{
  "rules": {
    "csstools/stylelint-use-logical": ["always", { "except": ['float', /^margin/] }]
  }
}
```


[cli-img]: https://img.shields.io/travis/csstools/stylelint-use-logical.svg
[cli-url]: https://travis-ci.org/csstools/stylelint-use-logical
[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[git-url]: https://gitter.im/stylelint/stylelint
[npm-img]: https://img.shields.io/npm/v/stylelint-use-logical.svg
[npm-url]: https://www.npmjs.com/package/stylelint-use-logical

[stylelint]: https://github.com/stylelint/stylelint
[stylelint configuration]: https://github.com/stylelint/stylelint/blob/master/docs/user-guide/configuration.md#readme
[Property Use Logical]: https://github.com/csstools/stylelint-use-logical
