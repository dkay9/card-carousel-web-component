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
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 ..." />
              </svg>
            </a>
            <a href="${preview}" target="_blank" aria-label="Live Preview">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M320 32c-17.7 0-32 14.3 ..." />
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

    // Previous navigation
    this.prevButton.addEventListener('click', () => {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.updateCardStyles();
      }
    });

    // Next navigation
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

    // Swipe gesture support for mobile
    const frame = this.shadowRoot.querySelector('.carousel-frame');

    frame.addEventListener('touchstart', (e) => {
      this.startX = e.touches[0].clientX;
    });

    frame.addEventListener('touchend', (e) => {
      this.endX = e.changedTouches[0].clientX;
      this.handleSwipe();
    });

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
