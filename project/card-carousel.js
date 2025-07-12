class CardCarousel extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
    }

    connectedCallback() {
        this.render()
    }

    render() {
        this.shadowRoot.innerHTML = `
        <style>
            .carousel-container {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            gap: 16px;
            padding: 16px;
            }

            ::-webkit-scrollbar {
            height: 8px;
            }

            ::-webkit-scrollbar-thumb {
            background-color: #aaa;
            border-radius: 4px;
            }

            .carousel-container ::slotted(card-item) {
            flex: 0 0 auto;
            scroll-snap-align: start;
            }
        </style>

        <div class="carousel-container">
            <slot></slot>
        </div>
        `
    }
}

customElements.define('card-carousel', CardCarousel)