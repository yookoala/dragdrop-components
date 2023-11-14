/**
 * @module
 * @description A draggable element.
 */

/**
 * @const {HTMLTemplateElement} template
 */
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
    z-index: 1000;
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
<div part="handle" class="handle full"></div>
<slot><p>(Draggable)</p></slot>
`;

/**
 * Create a shadow element for touch move.
 *
 * @param {object} options
 * @param {number} options.width
 * @param {number} options.height
 * @param {number} options.top
 * @param {number} options.left
 * @param {string|null} options.className
 *
 * @returns {HTMLElement}
 */
function createShadow({ width, height, top, left, className }) {
    const el = document.createElement('div');
    el.style.position = 'absolute';
    el.style.display = 'inline-block';
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
    el.style.top = `${top}px`;
    el.style.left = `${left}px`;
    el.style.pointerEvents = 'none';

    if (className) {
        el.classList.add(className);
    } else {
        el.style.zIndex = 1000;
        el.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        el.style.borderColor = 'rgba(255, 255, 255, 0.9)';
        el.style.borderStyle = 'solid';
        el.style.borderWidth = '1px';
    }

    return el;
}

/**
 * @typedef {object} Rect  The boundaries of an element.
 * @property {number} x
 * @property {number} y
 * @property {number} top
 * @property {number} right
 * @property {number} bottom
 * @property {number} left
 * @property {number} width
 * @property {number} height
 */

/**
 * Calculate the real bound of an element relative to the page.
 *
 * Element.getBoundingClientRect() method only returns DOMRect object
 * given information about the position of a rectangle relative to the
 * viewport.
 *
 * This function calculates, from the DOMRect or equivlant Rect object,
 * the real bound of the element relative to the page. That is to emilate
 * the scrolling offsets.
 *
 * @param {Rect|DOMRect} bound The boundaries of an element.
 *
 * @returns {Rect}
 */
function getRealBound({ x, y, top, right, bottom, left, width, height }) {
    return {
        x: x + window.scrollX,
        y: y + window.scrollY,
        top: top + window.scrollY,
        right: right + window.scrollX,
        bottom: bottom + window.scrollY,
        left: left + window.scrollX,
        width,
        height,
    };
}

/**
 * @classdesc A draggable element.
 * @class
 */
export default class DragDropChild extends HTMLElement {

    #shadowRoot;

    #previousParent = null;
    #touchShadowClass = null;
    #touchShadow = null; // shadow for touch moves
    #touchCurrentContainer = null; // container pointer for touchmove to dragover translation.

    /**
     * @constructor
     */
    constructor() {
        super();
        this.#shadowRoot = this.attachShadow({mode: 'closed'});
        this.#shadowRoot.appendChild(template.content.cloneNode(true));
        this.draggable = true;
    }

    /**
     * @override
     */
    connectedCallback() {
        this.addEventListener("touchstart", this.onTouchStart, {passive: false});
        this.addEventListener("touchend", this.onTouchEnd);
        this.addEventListener("touchmove", this.onTouchMove);
        this.addEventListener("dragstart", this.onDragStart);
        this.addEventListener("dragend", this.onDragEnd);
    }

    /**
     * Handler of the touch start event.
     *
     * @param {TouchEvent} event
     * @returns {void}
     */
    onTouchStart(event) {
        // Prevent touch start trigger on multiple nested child.
        event.stopPropagation();

        this.setAttribute('dragging', 'true'); // for container to know wich element is being dragged
        this.classList.add('dragging'); // for styling
        const boundRect = this.getBoundingClientRect();
        const realBoundRect = getRealBound(boundRect);
        this.#previousParent = this.parentElement;
        const touch = event.touches[0];

        if (this.#touchShadow) {
            this.#touchShadow.remove();
            this.#touchShadow = null;
        }

        // Essential styles to make the shadow follow the touch.
        this.#touchShadow = createShadow({

            // Boundaries of the element relative to viewport.
            width: realBoundRect.width,
            height: realBoundRect.height,
            top: realBoundRect.top,
            left: realBoundRect.left,

            // Athestic styles. If touch-shadow-class is set, the class will be added to the shadow.
            // and all athestic styling will be skipped.
            className: this.#touchShadowClass || null,
        });
        this.#touchShadow.dataset.startPageX = boundRect.top;
        this.#touchShadow.dataset.startPageY = boundRect.left;
        this.#touchShadow.dataset.startTouchPageX = touch.pageX;
        this.#touchShadow.dataset.startTouchPageY = touch.pageY;

        // To make this work, the shadow must be appended to the document.
        // Shadow DOM is not enough.
        document.documentElement.appendChild(this.#touchShadow);
    }

    /**
     * Handler of the touch move event.
     *
     * @param {TouchEvent} event
     * @returns {void}
     */
    onTouchMove(event) {
        event.stopPropagation();
        event.preventDefault();
        const touch = event.touches[0];

        if (this.#touchShadow) {
            const deltaX = touch.pageX - this.#touchShadow.dataset.startTouchPageX;
            const deltaY = touch.pageY - this.#touchShadow.dataset.startTouchPageY;
            this.#touchShadow.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        }

        // Find all the dragdrop containers on the page to check if the drag point is witnin
        // bound of any of them.
        const containers = document.querySelectorAll('dragdrop-container');
        const enteredContainers = [];
        for (const container of containers) {
            const boundRect = getRealBound(container.getBoundingClientRect());
            if (touch.pageX > boundRect.left && touch.pageX < boundRect.right
                && touch.pageY > boundRect.top && touch.pageY < boundRect.bottom
            ) {
                if (!this.isAncestorOf(container)) {
                    // Only include containers that is not the ancestor of this item.
                    enteredContainers.push(container);
                }
            } else if (this.#touchCurrentContainer === container) {
                // If the touch point is not within the container, but the container is the current
                // container, then the touch point has left the container.
                this.#touchCurrentContainer.dispatchEvent(new CustomEvent('dnd:dragleave', {bubbles: true}));
                this.#touchCurrentContainer = null;
            }
        }

        if (enteredContainers.length > 0) {
            // Find the inner most container
            const innerMostContainer = enteredContainers.reduce((a, b) => {
                const aBoundRect = a.getBoundingClientRect();
                const bBoundRect = b.getBoundingClientRect();
                if (aBoundRect.width * aBoundRect.height > bBoundRect.width * bBoundRect.height) {
                    return b;
                }
                return a;
            });

            // Trigger drag enter if the child has just entered this container.
            if (this.#touchCurrentContainer !== innerMostContainer) {
                this.#touchCurrentContainer = innerMostContainer; // remember the container for touchmove.
                innerMostContainer.dispatchEvent(new CustomEvent('dnd:dragenter', {bubbles: true}));
            }
            // Trigger drag over the innermost container anyway.
            innerMostContainer.dispatchEvent(new CustomEvent('dnd:dragover', {bubbles: true, detail: {
                clientX: touch.clientX,
                clientY: touch.clientY,
                pageX: touch.pageX,
                pageY: touch.pageY,
            }}));
        }
    }

    /**
     * Handler of the touch end event.
     *
     * @param {TouchEvent} event
     * @returns {void}
     */
    onTouchEnd(event) {
        this.removeAttribute('dragging'); // for container to know wich element is being dragged
        this.classList.remove('dragging'); // for styling
        const touch = event.changedTouches[0];

        // Clear simulation pointers.
        if (this.#touchShadow && this.#touchShadow.parentNode) {
            this.#touchShadow.remove();
        }
        this.#touchShadow = null;
        this.#touchCurrentContainer = null;

        // Find all the dragdrop containers on the page to check if the drag point is witnin
        // bound of any of them.
        const containers = document.querySelectorAll('dragdrop-container');
        for (const container of containers) {
            const boundRect = getRealBound(container.getBoundingClientRect());
            if (touch.pageX > boundRect.left && touch.pageX < boundRect.right
                && touch.pageY > boundRect.top && touch.pageY < boundRect.bottom
            ) {
                container.dispatchEvent(new CustomEvent('dnd:drop', {bubbles: true}));
            }
        }

        // Clear previous parent.
        this.#previousParent = null;
    }

    /**
     * Bounce back to the previous parent.
     *
     * @returns {void}
     */
    bounce() {
        if (this.#previousParent) {
            this.#previousParent.appendChild(this);
            this.#previousParent = null;
        }
    }

    /**
     * Handler of the drag start event.
     *
     * @param {MouseEvent} event
     * @returns {void}
     */
    onDragStart(event) {
        event.stopPropagation();
        this.#previousParent = this.parentElement;
        this.setAttribute('dragging', 'true'); // for container to know wich element is being dragged
        this.classList.add('dragging'); // for styling
    }

    /**
     * Handler of the drag end event.
     *
     * @param {MouseEvent} event
     * @returns {void}
     */
    onDragEnd(event) {
        this.removeAttribute('dragging');
        this.classList.remove('dragging');
    }

    /**
     * Getter of the attributes.
     *
     * @override
     */
    static get observedAttributes() {
        return ['handle'];
    }

    /**
     * @override
     *
     * @param {string} name
     * @param {string} oldValue
     * @param {string} newValue
     */
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
                case 'top-left':
                    handle.classList.remove('full');
                    handle.classList.add('left');
                    handle.classList.remove('right');
                    handle.classList.add('top');
                    handle.classList.remove('bottom');
                    break;
                case 'full':
                default:
                    handle.classList.add('full');
                    handle.classList.remove('left');
                    handle.classList.remove('right');
                    handle.classList.remove('top');
                    handle.classList.remove('bottom');
            }
        }
        if (name === 'touch-shadow-class') {
            this.#touchShadowClass = (newValue) ? newValue : null;
        }
    }

    /**
     * Check if this child is the ancestor of the given element.
     *
     * @param {HTMLElement} element
     *
     * @returns {boolean}
     */
    isAncestorOf(element) {
        let parent = element.parentElement;
        while (parent) {
            if (parent === this) {
                return true;
            }
            parent = parent.parentElement;
        }
        return false;
    }
}

customElements.define('dragdrop-child', DragDropChild);