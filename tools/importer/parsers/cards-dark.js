/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-dark. Base: cards.
 * Source: https://www.royalenfield.com/in/en/home/
 * Selectors: .herostripe, .motoculture, .iridegrid, .royal-enfield-shop-us
 * Model fields (card item): image (reference), text (richtext)
 * Block library: 2 cols per row. Col1=image, Col2=text(heading+description+CTA)
 * Container block: each child item = one row
 */
export default function parse(element, { document }) {
  const cells = [];

  // Detect which section variant we're in based on class
  const isHeadlights = element.classList.contains('herostripe');
  const isMotoculture = element.classList.contains('motoculture');
  const isIride = element.classList.contains('iridegrid');
  const isShop = element.classList.contains('royal-enfield-shop-us');

  let items = [];

  if (isHeadlights) {
    // Herostripe: banner items within swiper slides
    items = element.querySelectorAll('.banner-background-image, .swiper-slide');
    if (items.length === 0) items = element.querySelectorAll('img');
    items.forEach((item) => {
      const img = item.tagName === 'IMG' ? item : item.querySelector('img');
      const heading = item.querySelector('h2, h3, .card-title');
      const link = item.querySelector('a');

      const imgFrag = document.createDocumentFragment();
      imgFrag.appendChild(document.createComment(' field:image '));
      if (img) imgFrag.appendChild(img);

      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(' field:text '));
      if (heading) textFrag.appendChild(heading);
      if (link) textFrag.appendChild(link);

      cells.push([imgFrag, textFrag]);
    });
  } else if (isMotoculture) {
    // Motoculture: image cards in swiper
    items = element.querySelectorAll('.swiper-slide, .image-card');
    items.forEach((item) => {
      const img = item.querySelector('img');
      const text = item.querySelector('.text-section, h3, h2, p');

      const imgFrag = document.createDocumentFragment();
      imgFrag.appendChild(document.createComment(' field:image '));
      if (img) imgFrag.appendChild(img);

      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(' field:text '));
      if (text) textFrag.appendChild(text);

      cells.push([imgFrag, textFrag]);
    });
  } else if (isIride) {
    // iRide events grid
    items = element.querySelectorAll('.swiper-slide.grid-item, .card');
    items.forEach((item) => {
      const img = item.querySelector('img');
      const heading = item.querySelector('.iride-title, h3, h2');
      const content = item.querySelector('.content, p');

      const imgFrag = document.createDocumentFragment();
      imgFrag.appendChild(document.createComment(' field:image '));
      if (img) imgFrag.appendChild(img);

      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(' field:text '));
      if (heading) textFrag.appendChild(heading);
      if (content) textFrag.appendChild(content);

      cells.push([imgFrag, textFrag]);
    });
  } else if (isShop) {
    // Shop section: shop cards
    items = element.querySelectorAll('.shop-card');
    items.forEach((item) => {
      const img = item.querySelector('.shop-card__image, img');
      const title = item.querySelector('.shop-card__title, h3, h2');
      const desc = item.querySelector('.shop-card__description, p');
      const link = item.querySelector('.shop-card__button a, a');

      const imgFrag = document.createDocumentFragment();
      imgFrag.appendChild(document.createComment(' field:image '));
      if (img) imgFrag.appendChild(img);

      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(' field:text '));
      if (title) textFrag.appendChild(title);
      if (desc) textFrag.appendChild(desc);
      if (link) textFrag.appendChild(link);

      cells.push([imgFrag, textFrag]);
    });
  } else {
    // Generic fallback: find any repeating items
    items = element.querySelectorAll('.swiper-slide, li, [class*="card"]');
    items.forEach((item) => {
      const img = item.querySelector('img');
      const text = item.querySelector('h2, h3, p, a');

      const imgFrag = document.createDocumentFragment();
      imgFrag.appendChild(document.createComment(' field:image '));
      if (img) imgFrag.appendChild(img);

      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(' field:text '));
      if (text) textFrag.appendChild(text);

      cells.push([imgFrag, textFrag]);
    });
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-dark', cells });
  element.replaceWith(block);
}
