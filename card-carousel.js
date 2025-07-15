// ----------------------
// CardItem Component
// ----------------------
class CardItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['image', 'title', 'description', 'github', 'preview'];
  }

  attributeChangedCallback() {
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const image = this.getAttribute('image') || '';
    const title = this.getAttribute('title') || '';
    const description = this.getAttribute('description') || '';
    const github = this.getAttribute('github') || '#';
    const preview = this.getAttribute('preview') || '#';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          font-family: 'Segoe UI', sans-serif;
        }

        .card {
          width: 320px;
          border-radius: 12px;
          overflow: hidden;
          background: var(--card-bg, white);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .card:hover {
          transform: translateY(-6px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .card-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          display: block;
        }

        .card-body {
          padding: 16px;
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0 0 8px;
          color: var(--text-color, #222);
        }

        .card-description {
          font-size: 0.95rem;
          color: var(--text-muted, #666);
          margin: 0;
        }

        .card-icons {
          margin-top: 12px;
          display: flex;
          gap: 12px;
        }

        .card-icons a svg {
          fill: #555;
          width: 22px;
          height: 22px;
          transition: fill 0.3s ease;
        }

        .card-icons a:hover svg {
          fill: #007bff;
        }
      </style>

      <div class="card">
        <img src="${image}" alt="${title}" class="card-image" />
        <div class="card-body">
          <h3 class="card-title">${title}</h3>
          <p class="card-description">${description}</p>
          <div class="card-icons">
            <a href="${github}" target="_blank" aria-label="GitHub">
              <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                <path d="M12 0C5.37 0 0 5.373 0 12a12 12 0 008.21 11.39c.6.11.82-.26.82-.58v-2.16c-3.34.73-4.04-1.61-4.04-1.61-.54-1.36-1.33-1.72-1.33-1.72-1.09-.74.08-.72.08-.72 1.21.09 1.84 1.25 1.84 1.25 1.07 1.83 2.8 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.96 0-1.32.47-2.39 1.24-3.23-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.23 0 4.63-2.8 5.66-5.48 5.96.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58A12 12 0 0024 12c0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <a href="${preview}" target="_blank" aria-label="Live Preview">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="22" height="22" fill="currentColor">
                <path d="M432 320h-32a16 16 0 0 0-16 16v112H80V128h112a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16H64a64 64 0 0 0-64 64v320a64 64 0 0 0 64 64h320a64 64 0 0 0 64-64V336a16 16 0 0 0-16-16zm56-320H320a32 32 0 0 0-22.63 54.63L364.12 128 144 348.12a16 16 0 0 0 0 22.63l22.63 22.63a16 16 0 0 0 22.63 0L409.37 173.25l73.37 73.37A32 32 0 0 0 512 224V32a32 32 0 0 0-32-32z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('card-item', CardItem);


// ----------------------
// CardCarousel Component
// ----------------------
class CardCarousel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.currentIndex = 0;
    this.cards = [];
    this.startX = 0;
    this.endX = 0;
  }

  connectedCallback() {
    this.render();
    this.setup();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
          max-width: 1024px;
          margin: 0 auto;
        }

        .carousel-frame {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 360px;
          position: relative;
          overflow: hidden;
        }

        .carousel-track {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          position: relative;
        }

        ::slotted(card-item) {
          position: absolute;
          transition: all 0.5s ease;
          transform: scale(0.8);
          opacity: 0;
          filter: grayscale(100%);
          pointer-events: none;
        }

        ::slotted(.active) {
          transform: scale(1.1);
          opacity: 1;
          filter: grayscale(0%);
          z-index: 3;
          pointer-events: auto;
        }

        ::slotted(.left) {
          transform: translateX(-100%) scale(0.9);
          opacity: 0.6;
          z-index: 2;
        }

        ::slotted(.right) {
          transform: translateX(100%) scale(0.9);
          opacity: 0.6;
          z-index: 2;
        }

        ::slotted(.hidden) {
          display: none;
        }

        ::slotted(.left),
        ::slotted(.right) {
          cursor: pointer;
        }

        .nav {
          background: #ffffffcc;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          font-size: 18px;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          z-index: 4;
        }

        .nav:hover {
          background: #007bff;
          color: white;
        }

        .nav:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .nav.prev { left: 8px; }
        .nav.next { right: 8px; }

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
          <slot></slot>
        </div>
        <button class="nav next" aria-label="Next">&#10095;</button>
      </div>
      <div class="pagination-dots"></div>
    `;
  }

  setup() {
  this.cards = Array.from(this.querySelectorAll('card-item'));
  this.prevButton = this.shadowRoot.querySelector('.prev');
  this.nextButton = this.shadowRoot.querySelector('.next');

  // Navigation: Previous
  this.prevButton.addEventListener('click', () => {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateCardStyles();
    }
  });

  // Navigation: Next
  this.nextButton.addEventListener('click', () => {
    if (this.currentIndex < this.cards.length - 1) {
      this.currentIndex++;
      this.updateCardStyles();
    }
  });

  // Keyboard support
  this.setAttribute('tabindex', 0);
  this.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') this.prevButton.click();
    if (e.key === 'ArrowRight') this.nextButton.click();
  });

  // Swipe gesture support
  const frame = this.shadowRoot.querySelector('.carousel-frame');
  frame.addEventListener('touchstart', (e) => {
    this.startX = e.touches[0].clientX;
  });
  frame.addEventListener('touchend', (e) => {
    this.endX = e.changedTouches[0].clientX;
    this.handleSwipe();
  });

  // Initial render
  this.updateCardStyles();
}


  // Swipe logic
  handleSwipe() {
    const delta = this.startX - this.endX;
    const threshold = 50;

    if (delta > threshold && this.currentIndex < this.cards.length - 1) {
      this.currentIndex++;
      this.updateCardStyles();
    } else if (delta < -threshold && this.currentIndex > 0) {
      this.currentIndex--;
      this.updateCardStyles();
    }
  }

  // Core visual update logic
  updateCardStyles() {
    this.cards.forEach((card, i) => {
      card.classList.remove('active', 'left', 'right', 'hidden');

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

    // Bind click to side cards
    this.cards.forEach((card, index) => {
      card.onclick = null; // remove previous listeners

      if (card.classList.contains('left') || card.classList.contains('right')) {
        card.onclick = () => {
          this.currentIndex = index;
          this.updateCardStyles();
        };
      }
    });

    // Pagination dots
    const dotContainer = this.shadowRoot.querySelector('.pagination-dots');
    dotContainer.innerHTML = '';
    this.cards.forEach((_, index) => {
      const dot = document.createElement('span');
      if (index === this.currentIndex) dot.classList.add('active');
      dot.addEventListener('click', () => {
        this.currentIndex = index;
        this.updateCardStyles();
      });
      dotContainer.appendChild(dot);
    });

    // Disable nav buttons when at bounds
    this.prevButton.disabled = this.currentIndex === 0;
    this.nextButton.disabled = this.currentIndex === this.cards.length - 1;
  }
}

customElements.define('card-carousel', CardCarousel);
