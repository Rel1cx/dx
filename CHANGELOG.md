# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.7.1] - 2025-02-21

- Updated dependencies: `@types/node` to ^25.3.0, `effect` to ^3.19.18, `eslint` to ^10.0.1, `pnpm` to 10.30.1
- **tsl-dx**: Removed unused code from `nullish` rule
- Updated `tsl.config.ts` with ignore patterns for `.d.ts`, `dist/`, and `build/` directories

## [0.7.0] - 2025-02-11

### Added

- **tsl-dx**: Added configuration options to `no-multiline-template-expression-without-auto-dedent` rule:
  - `dedentTagNames`: Customize which tag names are considered valid dedent tags (default: `["dedent"]`)
  - `dedentTagImportCallback`: Customize how the import statement is generated when applying fixes
- **tsl-dx**: Enhanced `no-multiline-template-expression-without-auto-dedent` rule with auto-fix suggestions that add the dedent import and wrap multiline templates
- **tsl-dx**: Added `runtimeLibrary` option to `nullish` rule for configuring the unit import source

### Changed

- **tsl-dx**: Improved `nullish` rule to distinguish between type and value imports for `unit`

## [0.6.1] - 2025-02-10

### Fixed

- **tsl-dx**: Fixed `nullish` rule to distinguish between type and value imports for `unit`

## [0.6.0] - 2025-02-10

### Added

- **tsl-dx**: Added `no-multiline-template-expression-without-auto-dedent` ESLint rule
- **tsl-dx**: Added comprehensive test coverage for ESLint rules

### Changed

- Updated to ESLint 9.20.0

## [0.5.3] - 2025-02-08

### Fixed

- **tsl-dx**: Fixed `nullish` rule handling for declaration files

## [0.5.2] - 2025-02-08

### Changed

- Renamed package from `tsl-module` to `tsl-dx`

## [0.5.1] - 2025-02-07

### Changed

- **tsl-dx**: Renamed `consistent-nullish-comparison` rule to `nullish-comparison`

## [0.5.0] - 2025-02-07

### Added

- **tsl-dx**: Added `nullish` ESLint rule configuration

### Removed

- Dropped `tsl-local` package

## [0.4.0] - 2025-02-06

### Changed

- Updated dependencies: ESLint to 2.0.2, @eslint/compat to 1.1.0

## [0.3.1] - 2025-02-06

### Fixed

- Various bug fixes and improvements

## [0.3.0] - 2025-02-05

### Added

- Initial release with core functionality
