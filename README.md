# Drag Drop Components

Web components to simplify drag-drop interface coding. Suitable for all UI that user drag and drop
items from one container to another. Such as:

1. Kanban-like UI: Drag and drop an item from one board to another.
2. Board game: drag and drop pieces from one tile to another.

Live Examples: [https://yookoala.github.io/dragdrop-components/examples/][examples-url]

[![CI test][ci-badge]][ci-url] [![NPM][npm-badge]][npm-url] [![Downloads][npm-download-badge]][npm-url]

[examples-url]: https://yookoala.github.io/dragdrop-components/examples/
[ci-url]: https://github.com/yookoala/dragdrop-components/actions?query=branch%3Amain+workflow%3APlaywright
[ci-badge]: https://github.com/yookoala/dragdrop-components/actions/workflows/playwright.yml/badge.svg?branch=main
[npm-url]: https://www.npmjs.com/package/dragdrop-components
[npm-badge]: https://img.shields.io/npm/v/dragdrop-components
[npm-download-badge]: https://img.shields.io/npm/dm/dragdrop-components

---
**Table of Contents**
- [How to Use](#how-to-use)
  - [HTML](#html)
    - [Simple Example](#simple-example)
  - [NodeJS](#nodejs)
- [Contribution](#contribution)
  - [Building the Library](#building-the-library)
  - [Development Mode](#development-mode)
  - [Playwright Test](#playwright-test)
  - [Report Issue and Contribution](#report-issue-and-contribution)
- [License](#license)
---

## How to Use

### HTML

Just include the script from jsdelivr.net:

```html
<script src="https://cdn.jsdelivr.net/npm/dragdrop-components" type="module"></script>
```

They you can use these 2 custom elements in your HTML:

* `<dragdrop-child>`
  A div-like block element to be dragged arround and drop into containers.

* `<dragdrop-container>`
  A div-like block element to receive `<dragdrop-child>`.

No framework. Couldn't have been easier.

#### Simple Example

There is very little pre-defined CSS style to stand in the way. A simple
Kanban applicaiton can be structured like this:

```html
<style>
main {
    display: flex;
}
dragdrop-container {
    border: 1px solid #ddd;
    min-height: 3em; /** prevent empty container from disappearing */
}
dragdrop-child {
    border: 1px solid #ddd;
    min-height: 3em; /** prevent empty child from disappearing */
}
</style>
<main>
    <section id="todo">
        <h2>Todo</h2>
        <dragdrop-container>
            <dragdrop-child>
                <h3>My Task</h3>
            </dragdrop-child>
        </dragdrop-container>
    </section>
    <section id="doing">
        <h2>Doing</h2>
        <dragdrop-container></dragdrop-container>
    </section>
    <section id="done">
        <h2>Done</h2>
        <dragdrop-container></dragdrop-container>
    </section>
</main>
```

More examples can be found in [examples](examples).

### NodeJS

Install to your environment by:
```shell
npm install dragdrop-components
```

Use it on browser script:
```js
// For the side-effects.
import 'dragdrop-components';

// Then use like simple HTML element, for example.
const container1 = document.createElement('dragdrop-container');
const container2 = document.createElement('dragdrop-container');
const child = document.createElement('dragdrop-child');
container1.appendChild(child);
document.documentElement.appendChild(container1);
document.documentElement.appendChild(container2);
```

## Contribution

You are very welcome to modify and backport changes here.

The best way is to work or extend on the [examples](examples) along with proper
[test cases](tests). All example depends on, and should always depend on, the
built copy "dist/dragdrop-component.js" in this repository.

### Building the Library

This command will build the "dist/dragdrop-component.js" file for distribution.

```
npm install
npm run build
```

### Development Mode

To modify the library, you may run these to start the development mode.
The source files will be monitored and built into the "dist" folder.

```
npm install
npm run dev
```

### Playwright Test

This library uses Playwright test for the dragdrop effect verifications. To
prevent regression, please verify that your changes can pass Playwright tests.

Playwright also provides very good support to VSCode's debugger. If you do not
have a preferred editor, you're recommended to use [VSCode](https://playwright.dev/docs/getting-started-vscode)
along with the [Playwright Test](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)
plugin.

### Report Issue and Contribution

The library is hosted [here](https://github.com/yookoala/dragdrop-components). Please
use our [issue tracker](https://github.com/yookoala/dragdrop-components/issues) to
report issue, discuss or request new features. You're more than welcome to submit
[Pull Request](https://github.com/yookoala/dragdrop-components/pulls) for bug fixes
and new features.

## License

This software is licensed to the MIT License. A copy of the license can be found [here](LICENSE).
