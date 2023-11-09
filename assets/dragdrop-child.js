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

    #touchShadowClass = null;
    #touchShadow = null; // shadow for touch moves
    #touchCurrentContainer = null; // container pointer for touchmove to dragover translation.

    constructor() {
        super();
        this.#shadowRoot = this.attachShadow({mode: 'closed'});
        this.#shadowRoot.appendChild(template.content.cloneNode(true));
        this.draggable = true;
    }

    connectedCallback() {
        this.addEventListener("touchstart", this.onTouchStart, {passive: false});
        this.addEventListener("touchend", this.onTouchEnd);
        this.addEventListener("touchmove", this.onTouchMove);
        this.addEventListener("dragstart", this.onDragStart);
        this.addEventListener("dragend", this.onDragEnd);
    }

    onTouchStart(event) {
        this.setAttribute('dragging', 'true'); // for container to know wich element is being dragged
        this.classList.add('dragging'); // for styling
        const boundRect = this.getBoundingClientRect();

        if (this.#touchShadow) {
            this.#touchShadow.remove();
            this.#touchShadow = null;
        }
        this.#touchShadow = document.createElement('div');

        // Essential styles to make the shadow follow the touch.
        this.#touchShadow.style.position = 'fixed';
        this.#touchShadow.style.display = 'inline-block';
        this.#touchShadow.style.width = boundRect.width;
        this.#touchShadow.style.height = boundRect.height;
        this.#touchShadow.style.top = boundRect.top;
        this.#touchShadow.style.left = boundRect.left;
        this.#touchShadow.style.pointerEvents = 'none';
        this.#touchShadow.dataset.startPageX = boundRect.top;
        this.#touchShadow.dataset.startPageY = boundRect.left;
        this.#touchShadow.dataset.startTouchPageX = event.touches[0].pageX;
        this.#touchShadow.dataset.startTouchPageY = event.touches[0].pageY;

        // Athestic styles. If touch-shadow-class is set, the class will be added to the shadow.
        // and all athestic styling will be skipped.
        if (this.#touchShadowClass) {
            this.#touchShadow.classList.add('touch-shadow');
        } else {
            this.#touchShadow.style.zIndex = 1000;
            this.#touchShadow.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            this.#touchShadow.style.borderColor = 'rgba(255, 255, 255, 0.9)';
            this.#touchShadow.style.borderStyle = 'solid';
            this.#touchShadow.style.borderWidth = '1px';
        }

        // To make this work, the shadow must be appended to the document.
        // Shadow DOM is not enough.
        document.documentElement.appendChild(this.#touchShadow);
    }

    onTouchMove(event) {
        event.stopPropagation();
        event.preventDefault();

        if (this.#touchShadow) {
            const deltaX = event.touches[0].pageX - this.#touchShadow.dataset.startTouchPageX;
            const deltaY = event.touches[0].pageY - this.#touchShadow.dataset.startTouchPageY;
            this.#touchShadow.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        }

        // Find all the dragdrop containers on the page to check if the drag point is witnin
        // bound of any of them.
        const containers = document.querySelectorAll('dragdrop-container');
        for (const container of containers) {
            const boundRect = container.getBoundingClientRect();
            if (event.touches[0].pageX > boundRect.left && event.touches[0].pageX < boundRect.right
                && event.touches[0].pageY > boundRect.top && event.touches[0].pageY < boundRect.bottom
            ) {
                if (this.#touchCurrentContainer !== container) {
                    this.#touchCurrentContainer = container; // remember the container for touchmove.
                    container.dispatchEvent(new CustomEvent('dnd:dragenter', {bubbles: true}));
                } else {
                    container.dispatchEvent(new CustomEvent('dnd:dragover', {bubbles: true, detail: {
                        clientX: event.touches[0].clientX,
                        clientY: event.touches[0].clientY,
                        pageX: event.touches[0].pageX,
                        pageY: event.touches[0].pageY,
                    }}));
                }
            } else {
                container.dispatchEvent(new CustomEvent('dnd:dragleave', {bubbles: true}));
            }
        }
    }

    onTouchEnd(event) {
        this.removeAttribute('dragging'); // for container to know wich element is being dragged
        this.classList.remove('dragging'); // for styling

        // Clear simulation pointers.
        this.#touchShadow.remove();
        this.#touchShadow = null;
        this.#touchCurrentContainer = null;

        // Find all the dragdrop containers on the page to check if the drag point is witnin
        // bound of any of them.
        const containers = document.querySelectorAll('dragdrop-container');
        for (const container of containers) {
            const boundRect = container.getBoundingClientRect();
            if (event.changedTouches[0].pageX > boundRect.left && event.changedTouches[0].pageX < boundRect.right
                && event.changedTouches[0].pageY > boundRect.top && event.changedTouches[0].pageY < boundRect.bottom
            ) {
                container.dispatchEvent(new CustomEvent('dnd:drop', {bubbles: true}));
            }
        }
    }

    onDragStart(event) {
        this.setAttribute('dragging', 'true'); // for container to know wich element is being dragged
        this.classList.add('dragging'); // for styling
    }

    onDragEnd(event) {
        this.removeAttribute('dragging');
        this.classList.remove('dragging');
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
        if (name === 'touch-shadow-class') {
            this.#touchShadowClass = (newValue) ? newValue : null;
        }
    }

}

customElements.define('dragdrop-child', DragDropChild);