/**
 * @module
 * @description A container that can accept dragdrop-child.
 */

import DragDropChild from "./dragdrop-child";

/**
 * @const {HTMLTemplateElement} template
 */
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
     * @param {boolean} alreadyChildren Whether the child is already a child of this container.
     * @returns {boolean}
     */
    canAcceptChild(child, alreadyChildren = false) {
        const childrenLength = alreadyChildren ? this.children.length - 1 : this.children.length;
        const result = (
            // The child cannot be this container.
            (child !== this) &&

            // The child cannot be the ancestor (i.e. nested parent)
            // of this container.
            (!child.isAncestorOf || !child.isAncestorOf(this)) &&

            // The number of children cannot exceed the max-children attribute.
            (this.#maxChildren === -1 || childrenLength < this.#maxChildren)
        );
        return result;
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

        // Note
        // 1. dragover event will provide the dragged element as event.target.
        // 2. dnd:dragover will provide the container as event.target (because it is
        //    dispatched against the container) with dragged element as event.detail.target.
        const dragged = event?.detail?.target || this.getDraggedElement();
        if (!dragged) {
            return;
        }

        if (!this.canAcceptChild(dragged)) {
            // If the dragged item cannot be accepted by this container,
            // ignore the dragover event.
            return;
        }

        // Use either the clientY or the detail.clientY value.
        // Interoperable with both mouse and touch events.
        const closest = this.getDragBeforeElement(dragged, event?.detail?.clientY || event?.clientY);
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

        // Note
        // 1. dragover event will provide the dragged element as event.target.
        // 2. dnd:dragover will provide the container as event.target (because it is
        //    dispatched against the container) with dragged element as event.detail.target.
        const dragged = event?.detail?.target || this.getDraggedElement();
        if (!dragged) {
            return;
        }

        if (!this.canAcceptChild(dragged, this.isAncestorOf(dragged))) {
            if (dragged instanceof DragDropChild) {
                dragged.bounce();
            }
            return;
        }

        // Get the closest element after the drop point.
        // Put the dropped element before that element.
        const closest = this.getDragBeforeElement(dragged, event?.detail?.clientY || event?.clientY);
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

customElements.define('dragdrop-container', DragDropContainer);