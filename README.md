# Property Use Logical [<img src="https://jonathantneal.github.io/stylelint-logo.svg" alt="stylelint" width="90" height="90" align="right">][stylelint]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Support Chat][git-img]][git-url]

[Property Use Logical] is a [stylelint] rule to enforce the usage of
[Logical Properties and Values] in CSS.

Physical dimensions and directions are described _left_ to _right_ and _top_ to
_bottom_, while their logical counterparts are described _start_ to _end_ and
_inline_ or _block_.

---

For example, to add spacing before the start of a paragraph, we might use the
physical `padding-left` property.

```css
p {
  padding-left: 2em;
}
```

Were the content Hebrew or Arabic — flowing _right to left_ — then we might
use alternating `padding-left` and `padding-right` properties.

```css
p:dir(ltr) {
  padding-left: 2em;
}

p:dir(rtl) {
  padding-right: 2em;
}
```

Selector weight aside, we can instead use the logical `padding-inline-start`
property.

```css
p {
  padding-inline-start: 2em;
}
```

Similarly, physical _horizontal_ and _vertical_ dimensions are described
more succinctly using their logical counterparts.

```css
h1, h2, h3 {
  margin-top: 1em;
  margin-bottom: 1em;
}

blockquote {
  margin-left: 1em;
  margin-right: 1em;
}

/* becomes */

h1, h2, h3 {
  margin-block: 1em;
}

blockquote {
  margin-inline: 1em;
}
```

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
    "csstools/use-logical": ("always" || true) || ("ignore" || false || null)
  }
}
```

## Options

### always

The `"always"` option (alternatively `true`) requires logical properties and
values to be used, and the following patterns are _not_ considered violations:

```pcss
.inset {
  inset: 0;
}

.margin {
  margin-inline-start: 0;
}

.padding {
  padding-inline: 0;
}

.float {
  float: inline-start;
}

.text-align {
  text-align: start;
}

.text-align-ignored:dir(ltr) {
  text-align: left;
}
```

While the following patterns _are_ considered violations:

```pcss
.inset {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.margin {
  margin-left: 0;
}

.padding {
  padding-left: 0;
  padding-right: 0;
}

.float {
  float: left;
}

.text-align {
  text-align: left;
}
```

### ignore

The `"ignore"` option (alternatively `false` or `null`) disables the rule.

## Secondary Options

### except

The `except` option ignores reporting or autofixing properties and values
matching a case-insensitive string or regular expression.

```js
{
  "rules": {
    "csstools/use-logical": ["always", { "except": ['float', /^margin/i] }]
  }
}
```

### direction

The `direction` option controls whether _left to right_ or _right to left_
properties and values should be reported or autofixed.

```js
{
  "rules": {
    "csstools/use-logical": ["always", { "direction": "ltr" || "rtl" }]
  }
}
```

## Property and Value Mapping

Assuming _left to right_ directionality:

| Physical Property | Logical Property       |
| ----------------- | ---------------------- |
| `top`             | `inset-block-start`    |
| `right`           | `inset-inline-end`     |
| `bottom`          | `inset-block-end`      |
| `left`            | `inset-inline-start`   |

| Physical Property | Logical Property       |
| ----------------- | ---------------------- |
| `margin-top`      | `margin-block-start`   |
| `margin-right`    | `margin-inline-end`    |
| `margin-bottom`   | `margin-block-end`     |
| `margin-left`     | `margin-inline-start`  |

| Physical Property | Logical Property       |
| ----------------- | ---------------------- |
| `padding-top`     | `padding-block-start`  |
| `padding-right`   | `padding-inline-end`   |
| `padding-bottom`  | `padding-block-end`    |
| `padding-left`    | `padding-inline-start` |

| Physical Property | Logical Property       |
| ----------------- | ---------------------- |
| `width`           | `inline-size`          |
| `min-width`       | `min-inline-size`      |
| `max-width`       | `max-inline-size`      |
| `height`          | `block-size`           |
| `min-height`      | `min-block-size`       |
| `max-height`      | `max-block-size`       |

[cli-img]: https://img.shields.io/travis/csstools/stylelint-use-logical.svg
[cli-url]: https://travis-ci.org/csstools/stylelint-use-logical
[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[git-url]: https://gitter.im/stylelint/stylelint
[npm-img]: https://img.shields.io/npm/v/stylelint-use-logical.svg
[npm-url]: https://www.npmjs.com/package/stylelint-use-logical

[Logical Properties and Values]: https://www.w3.org/TR/css-logical-1/
[stylelint]: https://github.com/stylelint/stylelint
[stylelint configuration]: https://github.com/stylelint/stylelint/blob/master/docs/user-guide/configuration.md#readme
[Property Use Logical]: https://github.com/csstools/stylelint-use-logical
