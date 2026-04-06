export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 1) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'hero-showcase-wrapper';

  // Build slides from rows (each row = one slide: col0=image, col1=text)
  const slidesContainer = document.createElement('div');
  slidesContainer.className = 'hero-showcase-slides';

  const slides = [];
  rows.forEach((row, idx) => {
    const cols = [...row.children];
    const slide = document.createElement('div');
    slide.className = 'hero-showcase-slide';
    slide.dataset.index = idx;
    if (idx === 0) slide.classList.add('active');

    // Background image
    const bgLayer = document.createElement('div');
    bgLayer.className = 'hero-showcase-bg';
    const picture = cols[0]?.querySelector('picture');
    const img = cols[0]?.querySelector('img');
    if (picture) bgLayer.appendChild(picture);
    else if (img) bgLayer.appendChild(img);
    slide.appendChild(bgLayer);

    // Overlay
    const overlay = document.createElement('div');
    overlay.className = 'hero-showcase-overlay';
    slide.appendChild(overlay);

    // Content
    const content = document.createElement('div');
    content.className = 'hero-showcase-content';
    if (cols[1]) {
      const textContainer = cols[1].querySelector('div') || cols[1];
      while (textContainer.firstChild) {
        content.appendChild(textContainer.firstChild);
      }
    }
    // Style links as CTA buttons
    content.querySelectorAll('a').forEach((link) => {
      link.classList.add('hero-showcase-cta');
    });
    slide.appendChild(content);

    slidesContainer.appendChild(slide);
    slides.push(slide);
  });

  wrapper.appendChild(slidesContainer);

  // Carousel logic
  let currentSlide = 0;
  let autoplayTimer;

  function goToSlide(idx) {
    slides[currentSlide].classList.remove('active');
    wrapper.querySelectorAll('.hero-showcase-dot')[currentSlide]?.classList.remove('active');
    currentSlide = idx;
    slides[currentSlide].classList.add('active');
    wrapper.querySelectorAll('.hero-showcase-dot')[currentSlide]?.classList.add('active');
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % slides.length);
  }

  function startAutoplay() {
    autoplayTimer = setInterval(nextSlide, 5000);
  }

  function stopAutoplay() {
    clearInterval(autoplayTimer);
  }

  // Pagination dots (only if multiple slides)
  if (slides.length > 1) {
    const dots = document.createElement('div');
    dots.className = 'hero-showcase-dots';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = 'hero-showcase-dot';
      if (idx === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
      dot.addEventListener('click', () => goToSlide(idx));
      dots.appendChild(dot);
    });
    wrapper.appendChild(dots);
  }

  // Scroll to explore
  const scrollIndicator = document.createElement('div');
  scrollIndicator.className = 'hero-showcase-scroll';
  scrollIndicator.textContent = 'Scroll to explore';
  wrapper.appendChild(scrollIndicator);

  block.textContent = '';
  block.appendChild(wrapper);

  // Start autoplay
  if (slides.length > 1) {
    startAutoplay();
    block.addEventListener('mouseenter', stopAutoplay);
    block.addEventListener('mouseleave', startAutoplay);
  }
}
