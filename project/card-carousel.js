class CardCarousel extends HTMLElement {
  constructor() {
    super();
    // Attach Shadow DOM for style encapsulation
    this.attachShadow({ mode: 'open' });
    this.currentIndex = 0; // Track currently active card
    this.cards = [];       // Will hold <card-item> references
    this.startX = 0;
    this.endX = 0;
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
          max-width: 1024px;
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
          transform: translateX(-100%) scale(0.9);
          opacity: 0.6;
          z-index: 2;
        }

        /* Right-side card */
        ::slotted(.right) {
          transform: translateX(100%) scale(0.9);
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
        .nav:disabled {
          opacity: 0.3;
          cursor: not-allowed;
          pointer-events: none;
        }
        .pagination-dots {
          display: flex;
          justify-content: center;
          gap: 6px;
          margin-top: 16px;
        }

        .pagination-dots span {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #ccc;
          cursor: pointer;
          transition: background 0.3s;
        }

        .pagination-dots span.active {
          background: #007bff;
        }

      </style>

      <div class="carousel-frame">
        <button class="nav prev" aria-label="Previous">&#10094;</button>
        <div class="carousel-track">
          <slot></slot> <!-- Dynamic card content goes here -->
        </div>
        <button class="nav next" aria-label="Next">&#10095;</button>
      </div>
      <div class="pagination-dots"></div>
    `;
  }

  // Setup event listeners and assign dynamic behavior
  setup() {
    // Get all <card-item> children (light DOM)
    const slot = this.shadowRoot.querySelector('slot');
    this.cards = Array.from(this.querySelectorAll('card-item'));

    // Initialize first card view
    this.updateCardStyles();

    // Prev button
    this.prevButton = this.shadowRoot.querySelector('.prev');
    this.prevButton.addEventListener('click', () => {
    if (this.currentIndex > 0) {
        this.currentIndex--;
        this.updateCardStyles();
    }
    });

    // Next button
    this.nextButton = this.shadowRoot.querySelector('.next');
    this.nextButton.addEventListener('click', () => {
    if (this.currentIndex < this.cards.length - 1) {
        this.currentIndex++;
        this.updateCardStyles();
    }
    });

    // Swipe support for mobile
    const frame = this.shadowRoot.querySelector('.carousel-frame');

    frame.addEventListener('touchstart', (e) => {
    this.startX = e.touches[0].clientX;
    });

    frame.addEventListener('touchend', (e) => {
    this.endX = e.changedTouches[0].clientX;
    this.handleSwipe();
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
            } else if (i === this.currentIndex - 1) {
            card.classList.add('left');
            } else if (i === this.currentIndex + 1) {
            card.classList.add('right');
            } else {
            card.classList.add('hidden');
            }
        });

        // Rendering the pagination
        const dotContainer = this.shadowRoot.querySelector('.pagination-dots');
        if (dotContainer) {
        dotContainer.innerHTML = ''; // clear existing
        this.cards.forEach((_, index) => {
            const dot = document.createElement('span');
            if (index === this.currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => {
            this.currentIndex = index;
            this.updateCardStyles();
            });
            dotContainer.appendChild(dot);
        });
        }

        // 🔒 Disable/enable nav buttons appropriately
        if (this.prevButton && this.nextButton) {
            this.prevButton.disabled = this.currentIndex === 0;
            this.nextButton.disabled = this.currentIndex === this.cards.length - 1;
        }
    }
    handleSwipe() {
        const delta = this.startX - this.endX;
        const threshold = 50; // Minimum swipe distance

        if (delta > threshold && this.currentIndex < this.cards.length - 1) {
            // Swipe left → go to next
            this.currentIndex++;
            this.updateCardStyles();
        } else if (delta < -threshold && this.currentIndex > 0) {
            // Swipe right → go to previous
            this.currentIndex--;
            this.updateCardStyles();
        }
    }   

}

// Register the custom element
customElements.define('card-carousel', CardCarousel);
