# Drag Drop Components

Web components to simplify drag-drop interface coding. Suitable for all UI that user drag and drop
items from one container to another. Such as:

1. Kanban-like UI: Drag and drop an item from one board to another.
2. Board game: drag and drop pieces from one tile to another.

## How to Use

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

### Simple Example

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

## Development

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

### Report Issue and Contribution

The library is hosted [here](https://github.com/yookoala/dragdrop-components). Please
use our [issue tracker](https://github.com/yookoala/dragdrop-components/issues) to
report issue, discuss or request new features. You're more than welcome to submit
[Pull Request](https://github.com/yookoala/dragdrop-components/pulls) for bug fixes
and new features.

## License

This software is licensed to the MIT License. A copy of the license can be found [here](LICENSE).
