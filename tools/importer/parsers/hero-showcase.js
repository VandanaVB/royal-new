/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-showcase. Base: hero (carousel variant).
 * Source: https://www.royalenfield.com/in/en/home/
 * Selector: .swipercarousel.cmp--royal-enfield-swiper
 *
 * Extracts ALL carousel slides as separate rows.
 * Each row: col1 = image, col2 = title + CTA text
 * This creates a carousel-style block table that the JS decorator
 * will turn into a sliding hero carousel.
 */
export default function parse(element, { document }) {
  const slides = element.querySelectorAll('.swiper-slide:not(.swiper-slide-duplicate), .cmp-carousel__item:not(.swiper-slide-duplicate)');
  const cells = [];

  slides.forEach((slide) => {
    const img = slide.querySelector('img');
    if (!img) return;

    // Col 1: image
    const imgFrag = document.createDocumentFragment();
    imgFrag.appendChild(document.createComment(' field:image '));
    imgFrag.appendChild(img);

    // Col 2: title + CTA
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));

    // Extract title from paragraphs (skip image-only paragraphs)
    const paragraphs = slide.querySelectorAll('p, h2, h1');
    paragraphs.forEach((p) => {
      if (p.querySelector('img') && p.textContent.trim() === '') return;
      const text = p.textContent.trim();
      if (text) {
        const heading = document.createElement('h2');
        heading.textContent = text;
        textFrag.appendChild(heading);
      }
    });

    // Convert buttons to links
    slide.querySelectorAll('button').forEach((btn) => {
      const btnText = btn.textContent.trim();
      if (btnText) {
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = btnText;
        textFrag.appendChild(link);
      }
    });

    // Also capture any existing links
    slide.querySelectorAll('a').forEach((link) => {
      textFrag.appendChild(link);
    });

    cells.push([imgFrag, textFrag]);
  });

  if (cells.length === 0) {
    // Fallback: at least one empty row
    cells.push(['', '']);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-showcase', cells });
  element.replaceWith(block);
}
