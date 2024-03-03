# Changes to Property Use Logical

### 2.1.2 (March 3, 2024)

- Fix `exports` in `package.json` [#25](https://github.com/csstools/stylelint-use-logical/issues/25)
- Fix `except` plugin option [#3](https://github.com/csstools/stylelint-use-logical/issues/3)

### 2.1.1 (February 19, 2024)

- Updated: peer `stylelint` to `>= 11 < 17` (patch) [#22](https://github.com/csstools/stylelint-use-logical/pull/22)
- Fixed: compatibility with `stylelint` 16 (patch) [#22](https://github.com/csstools/stylelint-use-logical/pull/22)

### 2.1.0 (March 8, 2022)

- Updated: peer `stylelint` to >= 11 < 16 (patch)
- Added: Support for `width`, `height`, `min-width`, `min-height`, `max-width`, `max-height`.

### 2.0.0 (May 12, 2018)

- Updated: peer `stylelint` to >= 11 < 15 (major)
- Updated: Node 14+ compatibility (major)

### 1.1.0 (September 29, 2018)

- Added: `direction` option to control whether properties and values are
  reported or autofixed using _left to right_ or _right to left_ counterparts
- Fixed: Physical properties and values within `:dir(ltr)` or `:dir(rtl)` are
  ignored

### 1.0.1 (September 28, 2018)

- Fix usage name

### 1.0.0 (September 26, 2018)

- Initial version
