/* eslint-disable */
/* global WebImporter */

/**
 * Parser for headlights block.
 * Source: https://www.royalenfield.com/in/en/home/
 * Selector: .whats-tranding-container (parent of the In the Headlights Swiper)
 *
 * Extracts ALL spotlight slides as separate rows.
 * Each row: col1 = image, col2 = description + CTAs
 * Container block: each child item = one slide.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find swiper slides inside the container
  const slides = element.querySelectorAll('.swiper-slide:not(.swiper-slide-duplicate)');

  slides.forEach((slide) => {
    // Col 1: Image — prefer desktopBgImageReference, fallback to any img
    const desktopImg = slide.querySelector('img[title="desktopBgImageReference"]');
    const bgImg = slide.querySelector('.bg-img');
    const anyImg = slide.querySelector('img');
    const img = desktopImg || bgImg || anyImg;
    if (!img) return;

    const imgFrag = document.createDocumentFragment();
    imgFrag.appendChild(document.createComment(' field:image '));
    imgFrag.appendChild(img);

    // Col 2: Text content (title + description + CTAs)
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));

    // Title (h2 or card-title)
    const title = slide.querySelector('h2, .card-title');
    if (title) {
      const h2 = document.createElement('h2');
      h2.textContent = title.textContent.trim();
      textFrag.appendChild(h2);
    }

    // Description (first p or card-description)
    const desc = slide.querySelector('.card-description, p');
    if (desc && desc.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      textFrag.appendChild(p);
    }

    // CTA links
    const ctaContainer = slide.querySelector('.cta-buttons');
    const ctas = ctaContainer
      ? ctaContainer.querySelectorAll('a')
      : slide.querySelectorAll('a');

    ctas.forEach((cta) => {
      const link = document.createElement('a');
      link.href = cta.href || '#';
      link.textContent = cta.textContent.trim();
      textFrag.appendChild(link);
    });

    // Convert buttons to links
    slide.querySelectorAll('button').forEach((btn) => {
      const btnText = btn.textContent.trim();
      if (btnText && btnText !== 'prev' && btnText !== 'next') {
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = btnText;
        textFrag.appendChild(link);
      }
    });

    cells.push([imgFrag, textFrag]);
  });

  if (cells.length === 0) return;

  const block = WebImporter.Blocks.createBlock(document, { name: 'headlights', cells });
  element.replaceWith(block);
}
