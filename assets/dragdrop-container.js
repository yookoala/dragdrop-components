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
 * A container that can accept draggable elements.
 */
class DragDropContainer extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        // When an element is dragged into or out of this container.
        this.addEventListener("dragenter", this.onDragEnter);
        this.addEventListener("dragleave", this.onDragLeave);

        // During and right after the drop on this container.
        this.addEventListener("dragover", this.onDragOver);
        this.addEventListener("drop", this.onDrop);
    }

    onDragEnter(event) {
        event.preventDefault();
        event.stopPropagation();
        this.classList.add('active');
    }

    onDragLeave(event) {
        event.preventDefault();
        event.stopPropagation();
        this.classList.remove('active');
    }

    onDragOver(event) {
        event.preventDefault();
        event.stopPropagation();
        const dragged = this.getDraggedElement();
        if (!dragged) {
            return;
        }
        const closest = this.getDragBeforeElement(dragged, event.clientY);
        if (closest.element) {
            closest.element.before(dragged);
            return;
        }
        this.appendChild(dragged);
    }


    onDrop(event) {
        this.classList.remove('active');
        const dragged = this.getDraggedElement();
        if (!dragged) {
            return;
        }
        const closest = this.getDragBeforeElement(dragged, event.clientY);
        if (closest.element) {
            closest.element.before(dragged);
            return;
        }
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

}

customElements.define('dragdrop-container', DragDropContainer);