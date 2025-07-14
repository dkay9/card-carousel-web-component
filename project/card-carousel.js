class CardCarousel extends HTMLElement {
  constructor() {
    super();
    // Attach Shadow DOM for style encapsulation
    this.attachShadow({ mode: 'open' });
    this.currentIndex = 0; // Track currently active card
    this.cards = [];       // Will hold <card-item> references
  }

  // Called when the element is added to the DOM
  connectedCallback() {
    this.render(); // Inject HTML & styles into shadow DOM
    this.setup();  // Setup DOM references and event listeners
  }

  // Render the internal HTML and CSS of the carousel
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          overflow: hidden;
        }

        /* Main layout wrapper */
        .carousel-frame {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 360px;
        }

        /* Wrapper that holds slotted card-items */
        .carousel-track {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }

        /* Base style for every card-item */
        ::slotted(card-item) {
          position: absolute;
          transition: all 0.5s ease;
          transform: scale(0.8);
          opacity: 0;
          filter: grayscale(100%);
          pointer-events: none;
          width: 300px;
          max-width: 90%;
        }

        /* Centered active card */
        ::slotted(.active) {
          transform: scale(1.1);
          opacity: 1;
          filter: grayscale(0%);
          z-index: 3;
          pointer-events: auto;
        }

        /* Left-side card */
        ::slotted(.left) {
          transform: translateX(-140%) scale(0.9);
          opacity: 0.6;
          z-index: 2;
        }

        /* Right-side card */
        ::slotted(.right) {
          transform: translateX(140%) scale(0.9);
          opacity: 0.6;
          z-index: 2;
        }

        /* Hide cards not adjacent to currentIndex */
        ::slotted(.hidden) {
          display: none;
        }

        /* Prev/Next navigation buttons */
        .nav {
          background: #ffffffcc;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          font-size: 18px;
          font-weight: bold;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          z-index: 4;
          transition: background 0.3s ease;
        }

        .nav:hover {
          background: #007bff;
          color: white;
        }

        .nav.prev {
          left: 8px;
        }

        .nav.next {
          right: 8px;
        }
      </style>

      <div class="carousel-frame">
        <button class="nav prev" aria-label="Previous">&#10094;</button>
        <div class="carousel-track">
          <slot></slot> <!-- Dynamic card content goes here -->
        </div>
        <button class="nav next" aria-label="Next">&#10095;</button>
      </div>
    `;
  }

  // Setup event listeners and assign dynamic behavior
  setup() {
    // Get all <card-item> children (light DOM)
    const slot = this.shadowRoot.querySelector('slot');
    this.cards = Array.from(this.querySelectorAll('card-item'));

    // Initialize first card view
    this.updateCardStyles();

    // Handle Prev button click
    this.shadowRoot.querySelector('.prev').addEventListener('click', () => {
      this.currentIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
      this.updateCardStyles();
    });

    // Handle Next button click
    this.shadowRoot.querySelector('.next').addEventListener('click', () => {
      this.currentIndex = (this.currentIndex + 1) % this.cards.length;
      this.updateCardStyles();
    });

    // Optional: Keyboard navigation (← / →)
    this.setAttribute('tabindex', 0);
    this.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.shadowRoot.querySelector('.prev').click();
      if (e.key === 'ArrowRight') this.shadowRoot.querySelector('.next').click();
    });
  }

  // Apply appropriate classes to cards based on current index
  updateCardStyles() {
    this.cards.forEach((card, i) => {
      // Reset all state classes
      card.classList.remove('active', 'left', 'right', 'hidden');

      // Assign position-based class
      if (i === this.currentIndex) {
        card.classList.add('active');
      } else if (i === (this.currentIndex - 1 + this.cards.length) % this.cards.length) {
        card.classList.add('left');
      } else if (i === (this.currentIndex + 1) % this.cards.length) {
        card.classList.add('right');
      } else {
        card.classList.add('hidden');
      }
    });
  }
}

// Register the custom element
customElements.define('card-carousel', CardCarousel);
