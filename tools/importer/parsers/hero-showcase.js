/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-showcase. Base: hero.
 * Source: https://www.royalenfield.com/in/en/home/
 * Selector: .homeherobanner
 * Model fields: image (reference), imageAlt (collapsed), text (richtext)
 * Block library: 1 col, row 1=image, row 2=text(heading+description+CTA)
 */
export default function parse(element, { document }) {
  // Extract slides from the swiper
  const slides = element.querySelectorAll('.swiper-slide:not(.swiper-slide-duplicate)');
  // Use the active slide, or the first slide as fallback
  let activeSlide = element.querySelector('.swiper-slide-active');
  if (!activeSlide && slides.length > 0) activeSlide = slides[0];
  if (!activeSlide) activeSlide = element;

  // Row 1: Background image
  const bgImg = activeSlide.querySelector('img.bg-img, .card-image img, img');
  const imageCell = [];
  if (bgImg) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(' field:image '));
    frag.appendChild(bgImg);
    imageCell.push(frag);
  }

  // Row 2: Text content (heading + description + CTAs)
  const textCell = [];
  const frag2 = document.createDocumentFragment();
  frag2.appendChild(document.createComment(' field:text '));

  const heading = activeSlide.querySelector('.card-title, h2, h1');
  if (heading) frag2.appendChild(heading);

  const description = activeSlide.querySelector('.card-description, p');
  if (description) frag2.appendChild(description);

  const ctaContainer = activeSlide.querySelector('.cta-buttons');
  if (ctaContainer) {
    const links = ctaContainer.querySelectorAll('a');
    links.forEach((link) => frag2.appendChild(link));
  }

  textCell.push(frag2);

  const cells = [];
  if (imageCell.length > 0) cells.push(imageCell);
  if (textCell.length > 0) cells.push(textCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-showcase', cells });
  element.replaceWith(block);
}
