class CardItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' })
    }

    static get observedAttributes() {
        return ['image', 'title', 'description', 'github', 'preview']
    }

    attributeChangedCallback() {
        this.render()
    }

    connectedCallback() {
        this.render()
    }

    render() {
        const image = this.getAttribute('image') || ''
        const title = this.getAttribute('title') || ''
        const description = this.getAttribute('title') || ''
        const github = this.getAttribute('github') || '#'
        const preview = this.getAttribute('preview') || '#'
    }
}