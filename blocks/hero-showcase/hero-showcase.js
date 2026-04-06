export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 1) return;

  // Hero model: row 0 = image, row 1 = text (heading + description + CTAs)
  const imageRow = rows[0];
  const textRow = rows[1];

  // Build hero structure
  const wrapper = document.createElement('div');
  wrapper.className = 'hero-showcase-wrapper';

  // Background image
  const bgLayer = document.createElement('div');
  bgLayer.className = 'hero-showcase-bg';
  const picture = imageRow?.querySelector('picture');
  if (picture) {
    bgLayer.appendChild(picture);
  }
  wrapper.appendChild(bgLayer);

  // Overlay
  const overlay = document.createElement('div');
  overlay.className = 'hero-showcase-overlay';
  wrapper.appendChild(overlay);

  // Content
  const content = document.createElement('div');
  content.className = 'hero-showcase-content';

  if (textRow) {
    // Move all content from text row
    const textContainer = textRow.querySelector('div') || textRow;
    while (textContainer.firstChild) {
      content.appendChild(textContainer.firstChild);
    }
  }

  // Style links as CTA buttons
  content.querySelectorAll('a').forEach((link) => {
    link.classList.add('hero-showcase-cta');
  });

  wrapper.appendChild(content);

  block.textContent = '';
  block.appendChild(wrapper);
}
