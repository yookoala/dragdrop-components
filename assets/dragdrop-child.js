const template = document.createElement('template');
template.innerHTML = `
<style>
:host {
    display: block;
    position: relative;
    transition: opacity 0.1s ease-in-out, transform 0.2s ease-in-out;
}
:host(.dragging) {
    opacity: 0.7;
    transform: scale(0.98);
}

.handle {
    position: absolute;
    width: 40px;
    height: 40px;
    outline: 1px solid black;
    background-color: rgba(0, 0, 0, 0.1);
    cursor: move;
    transition: background-color 0.1s ease-in-out;
}
.handle:hover, :host(.active) .handle {
    background-color: rgba(0, 0, 0, 0.5);
}
.handle.top {
    top: 10px;
}
.handle.bottom {
    bottom: 10px;
}
.handle.left {
    left: 10px;
}
.handle.right {
    right: 10px;
}
.handle.full {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0;
    cursor: move;
}

</style>
<div part="handle" class="handle top left"></div>
<slot><p>(Draggable)</p></slot>
`;

/**
 * A draggable element.
 */
class DragDropChild extends HTMLElement {

    #shadowRoot;

    constructor() {
        super();
        this.#shadowRoot = this.attachShadow({mode: 'closed'});
        this.#shadowRoot.appendChild(template.content.cloneNode(true));
        this.draggable = true;
    }

    connectedCallback() {
        this.addEventListener("dragstart", this.onDragStart);
        this.addEventListener("dragend", this.onDragEnd);
    }

    onDragStart(event) {
        if (!event?.target?.id) {
            console.error('no id on target for drag drop', event.target);
            return;
        }
        this.setAttribute('dragging', 'true'); // for container to know wich element is being dragged
        event.target.classList.add('dragging'); // for styling
    }

    onDragEnd(event) {
        this.removeAttribute('dragging');
        event.target.classList.remove('dragging');
    }

    static get observedAttributes() {
        return ['handle'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'handle') {
            const handle = this.#shadowRoot.querySelector('.handle');
            switch (newValue) {
                case 'top-right':
                    handle.classList.remove('full');
                    handle.classList.remove('left');
                    handle.classList.add('right');
                    handle.classList.add('top');
                    handle.classList.remove('bottom');
                    break;
                case 'bottom-left':
                    handle.classList.remove('full');
                    handle.classList.add('left');
                    handle.classList.remove('right');
                    handle.classList.remove('top');
                    handle.classList.add('bottom');
                    break;
                case 'bottom-right':
                    handle.classList.remove('full');
                    handle.classList.remove('left');
                    handle.classList.add('right');
                    handle.classList.remove('top');
                    handle.classList.add('bottom');
                    break;
                case 'full':
                    handle.classList.add('full');
                    handle.classList.remove('left');
                    handle.classList.remove('right');
                    handle.classList.remove('top');
                    handle.classList.remove('bottom');
                    break;
                case 'top-left':
                default:
                    handle.classList.remove('full');
                    handle.classList.add('left');
                    handle.classList.remove('right');
                    handle.classList.add('top');
                    handle.classList.remove('bottom');
                    console.error('unknown position', newValue);
            }
        }
    }

}

customElements.define('dragdrop-child', DragDropChild);