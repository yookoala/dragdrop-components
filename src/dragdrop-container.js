const template = document.createElement('template');
template.innerHTML = `
<style>
:host {
    display: block;
    position: relative;
}
:host(.active) {
    outline: 2px dashed black;
}
</style>
<slot></slot>
`;

/**
 * @class
 * @classdesc A container that can accept draggable elements.
 */
export default class DragDropContainer extends HTMLElement {

    #maxChildren = -1;

    /**
     * @constructor
     */
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    /**
     * @override
     */
    connectedCallback() {
        // When an element is dragged into or out of this container.
        this.addEventListener("dragenter", this.onDragEnter);
        this.addEventListener("dragleave", this.onDragLeave);

        // During and right after the drop on this container.
        this.addEventListener("dragover", this.onDragOver);
        this.addEventListener("drop", this.onDrop);

        // Simulated event triggered by <dragdrop-child> when
        // touched and dragged.
        this.addEventListener("dnd:dragenter", this.onDragEnter);
        this.addEventListener("dnd:dragleave", this.onDragLeave);
        this.addEventListener("dnd:dragover", this.onDragOver);
        this.addEventListener("dnd:drop", this.onDrop);
    }

    /**
     * Handler of the drag start event.
     *
     * @param {HTMLElement} child  The child to be dragged into this container.
     * @returns {boolean}
     */
    canAcceptChild(child) {
        return (this.#maxChildren === -1 || this.children.length <= this.#maxChildren);
    }

    /**
     * Handler of the drag enter event, or the emulated touch drag enter event.
     *
     * @param {MouseEvent|CustomEvent} event
     * @returns {void}
     */
    onDragEnter(event) {
        event.preventDefault();
        event.stopPropagation();
        this.classList.add('active');
    }

    /**
     * Handler of the drag leave event, or the emulated touch drag leave event.
     *
     * @param {MouseEvent|CustomEvent} event
     * @returns {void}
     */
    onDragLeave(event) {
        event.preventDefault();
        event.stopPropagation();
        this.classList.remove('active');
    }

    /**
     * Handler of the drag over event, or the emulated touch drag over event.
     *
     * @param {MouseEvent|CustomEvent} event
     * @returns {void}
     */
    onDragOver(event) {
        event.preventDefault();
        event.stopPropagation();
        const dragged = this.getDraggedElement();
        if (!dragged) {
            return;
        }

        if (dragged?.isAncestorOf(this)) {
            // If the dragged item is an ancestor of this container,
            // ignore the dragover event.
            return;
        }

        // Use either the clientY or the detail.clientY value.
        // Interoperable with both mouse and touch events.
        const closest = this.getDragBeforeElement(dragged, event.clientY || event?.detail.clientY);
        if (closest.element) {
            closest.element.before(dragged);
            return;
        }
        this.appendChild(dragged);
    }

    /**
     * Handler of the drop event, or the emulated touch drop event.
     *
     * @param {MouseEvent|CustomEvent} event
     * @returns {void}
     */
    onDrop(event) {
        // Only trigger the inner most container's onDrop.
        event.stopPropagation();

        // Clear the active style.
        this.classList.remove('active');
        const dragged = this.getDraggedElement();
        if (!dragged) {
            return;
        }

        if (dragged?.isAncestorOf(this)) {
            // If the dragged item is an ancestor of this container,
            // ignore the drop event.
            return;
        }

        // Get the closest element after the drop point.
        // Put the dropped element before that element.
        const closest = this.getDragBeforeElement(dragged, event.clientY);
        if (closest.element) {
            closest.element.before(dragged);
            return;
        }

        // If nothing is before the drop point, put the dropped element at the end.
        this.appendChild(dragged);
    }

    /**
     * Find the dragged element by looking for the element with
     * attribute `draggable=true` and `dragging=true`.
     *
     * Note: <custom-child> elements will self-set `dragging=true`
     * on "dragstart" event. This is a bit of a hack, but it works.
     *
     * @returns {HTMLElement}
     */
    getDraggedElement() {
        return document.querySelector('[draggable=true][dragging=true]');
    }

    /**
     * Find, in this container, the element that the dragged element should
     * be dragged before. i.e. Find the element with the middle closest but
     * below the dragging event Y position.
     *
     * If not found, return null. That means the dragged element should be
     * place at the end of this container.
     *
     * @param {HTMLElement} dragged The dragged element.
     * @param {Number} clientY The event.clientY value of the drag event.
     * @returns
     */
    getDragBeforeElement(dragged, clientY) {
        return [...this.children].reduce((closest, child) => {
            if (child === dragged) {
                return closest;
            }

            const box = child.getBoundingClientRect();
            const offset = clientY - (box.top + box.top + box.height) / 2;
            if (offset >= 0 || offset < closest.offset) {
                return closest;
            }

            return {offset, element: child};
        }, {offset: Number.NEGATIVE_INFINITY});
    }

   /**
     * Getter of the attributes.
     *
     * @override
     */
   static get observedAttributes() {
        return ['max-children'];
    }

    /**
     * @override
     *
     * @param {string} name
     * @param {string} oldValue
     * @param {string} newValue
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'max-children') {
            this.#maxChildren = Number.parseInt(newValue);
        }
    }
}

customElements.define('dragdrop-container', DragDropContainer);