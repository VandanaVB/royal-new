/**
 * Headlights Block — center-focused carousel with dark card container.
 * Click-only navigation. Blurred bg from active slide.
 * Adjacent slides show images only at edges.
 */
export default function decorate(block) {
  // Prevent duplicate — only first headlights block renders
  if (document.querySelector('.headlights .hl-wrapper')) {
    block.style.display = 'none';
    const pw = block.closest('.headlights-wrapper');
    if (pw) pw.style.display = 'none';
    return;
  }

  const rows = [...block.children];
  if (rows.length === 0) return;

  const slides = [];
  const imgSrcs = [];

  rows.forEach((row) => {
    const cols = [...row.children];
    const slide = document.createElement('div');
    slide.className = 'hl-slide';

    // Image
    const pic = cols[0]?.querySelector('picture, img');
    const imgEl = pic?.querySelector('img') || pic;
    const src = imgEl?.src || '';
    imgSrcs.push(src);

    if (pic) {
      const imgWrap = document.createElement('div');
      imgWrap.className = 'hl-slide-img';
      imgWrap.appendChild(pic);
      slide.appendChild(imgWrap);
    }

    // Card content (text + CTAs)
    const card = document.createElement('div');
    card.className = 'hl-slide-card';

    if (cols[1]) {
      const content = cols[1].querySelector('div') || cols[1];
      while (content.firstChild) card.appendChild(content.firstChild);
    }

    // Wrap links as CTAs
    const links = card.querySelectorAll('a');
    if (links.length > 0) {
      const ctas = document.createElement('div');
      ctas.className = 'hl-ctas';
      links.forEach((l) => {
        l.classList.add('hl-cta');
        ctas.appendChild(l);
      });
      card.querySelectorAll('p:empty').forEach((p) => p.remove());
      card.appendChild(ctas);
    }

    slide.appendChild(card);
    slides.push(slide);
  });

  // Build DOM
  const wrapper = document.createElement('div');
  wrapper.className = 'hl-wrapper';

  // Heading
  const heading = document.createElement('h2');
  heading.className = 'hl-heading';
  heading.textContent = 'In the headlights';
  wrapper.appendChild(heading);

  // Blurred background
  const bg = document.createElement('div');
  bg.className = 'hl-bg';
  if (imgSrcs[0]) bg.style.backgroundImage = `url(${imgSrcs[0]})`;
  wrapper.appendChild(bg);

  // Track
  const track = document.createElement('div');
  track.className = 'hl-track';
  slides.forEach((s, i) => {
    s.dataset.index = i;
    if (i === 0) s.classList.add('active');
    track.appendChild(s);
  });
  wrapper.appendChild(track);

  // Slide width percentage — must match CSS flex-basis
  const pct = () => {
    if (window.innerWidth >= 900) return 58;
    if (window.innerWidth >= 600) return 65;
    return 80;
  };

  // Offset = slide index * slide width
  const offset = (i) => i * pct();

  // Initial position
  track.style.transform = 'translateX(0%)';

  // Nav
  let cur = 0;

  const goTo = (i) => {
    let t = i;
    if (t < 0) t = slides.length - 1;
    if (t >= slides.length) t = 0;
    slides[cur].classList.remove('active');
    cur = t;
    slides[cur].classList.add('active');
    track.style.transform = `translateX(-${offset(cur)}%)`;
    // Update blurred background to match active slide
    if (imgSrcs[cur]) bg.style.backgroundImage = `url(${imgSrcs[cur]})`;
  };

  if (slides.length > 1) {
    const nav = document.createElement('div');
    nav.className = 'hl-nav';

    const prev = document.createElement('button');
    prev.className = 'hl-prev';
    prev.type = 'button';
    prev.setAttribute('aria-label', 'Previous');

    const next = document.createElement('button');
    next.className = 'hl-next';
    next.type = 'button';
    next.setAttribute('aria-label', 'Next');

    nav.appendChild(prev);
    nav.appendChild(next);
    wrapper.appendChild(nav);

    prev.addEventListener('click', () => goTo(cur - 1));
    next.addEventListener('click', () => goTo(cur + 1));
  }

  block.textContent = '';
  block.appendChild(wrapper);
}
