/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-legacy. Base: carousel.
 * Source: https://www.royalenfield.com/in/en/home/
 * Selector: .swipercarousel.swiper-container--legacy
 * Model fields (carousel-legacy-item): media_image, media_imageAlt (collapsed), content_text
 * Grouped: media_* in one cell, content_* in one cell.
 * Block library: 2 cols per row. Col1=image, Col2=text(heading+description+CTA)
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find legacy carousel slides
  const slides = element.querySelectorAll('.legacy, .swiper-slide, .cmp-carousel__item');

  slides.forEach((slide) => {
    const img = slide.querySelector('img');
    const heading = slide.querySelector('h2, h3, .heading');
    const description = slide.querySelector('p, .description');
    const link = slide.querySelector('a.read-more, a.button, a');

    // Col 1: Image with field hint
    const imgFrag = document.createDocumentFragment();
    imgFrag.appendChild(document.createComment(' field:media_image '));
    if (img) imgFrag.appendChild(img);

    // Col 2: Text content with field hint
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:content_text '));
    if (heading) textFrag.appendChild(heading);
    if (description) textFrag.appendChild(description);
    if (link) textFrag.appendChild(link);

    cells.push([imgFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-legacy', cells });
  element.replaceWith(block);
}
