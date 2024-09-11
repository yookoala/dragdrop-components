# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

(no changes yet)

## [0.3.1]

### Changed
- GitHub Workflows updates.

## [0.3]

### Changed
- **Breaking**: touch events renamed from `dnd:*` to `dndtouch:*`.
- Update README.md for the new Events.

### Added
- New unified events
  - `<dragdrop-container>`
    - `dnd:dragleave`
    - `dnd:dropped`
    - `dnd:bounced`
  - `<dragdrop-child>`
    - `dnd:dragstart`
    - `dnd:dragend`
- Added tests to include event testings.
- Added [CHANGELOG.md](CHANGELOG.md)

## [0.2.5]

### Changed
- Build documentation site (GitHub Pages) with [GitHub Workflow](.github/workflows/jekyll-gh-pages.yml).
- Example as documentation.
- Refactor and bugfixes.

## [0.2.4]

### Changed
- Improved GitHub CI workflow.
- Add jsconfig.json.
- Code refactoring.


## [0.2.3]

### Changed
- Improved documentation in README.md.
- Improved test specification in playwright. Run examples as tests.

## [0.2.2]

### Changed
- Improved documentation in README.md.
- Improved jsdoc in comments.
- Renamed main distributed bundle from `index.js` to `dragdrop-components.js`.

## [0.2.1]

### Changed
- Add keywords in package.json for npm listing.


## [0.2]

### Added
- License and README.md.
- .editorconfig file.

### Changed
- Project structure for npm publishing.
- Improved documentation on methods.

## [0.1]

### Added

- Basic proof-of-concept code base.
- Nested container support.
- Tests with playwright.
- GitHub workflow to run CI tests.

[Unreleased]: https://github.com/yookoala/dragdrop-components/compare/v0.3.1...HEAD
[0.3.1]: https://github.com/yookoala/dragdrop-components/compare/v0.3...v0.3.1
[0.3]: https://github.com/yookoala/dragdrop-components/compare/v0.2.5...v0.3
[0.2.5]: https://github.com/yookoala/dragdrop-components/compare/v0.2.4...v0.2.5
[0.2.4]: https://github.com/yookoala/dragdrop-components/compare/v0.2.3...v0.2.4
[0.2.3]: https://github.com/yookoala/dragdrop-components/compare/v0.2.2...v0.2.3
[0.2.2]: https://github.com/yookoala/dragdrop-components/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/yookoala/dragdrop-components/compare/v0.2...v0.2.1
[0.2]: https://github.com/yookoala/dragdrop-components/compare/v0.1...v0.2
[0.1]: https://github.com/yookoala/dragdrop-components/releases/tag/v0.1