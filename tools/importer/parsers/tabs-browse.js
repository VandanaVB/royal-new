/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs-browse. Base: tabs.
 * Source: https://www.royalenfield.com/in/en/home/
 * Selector: .motorcyclewithcategories
 *
 * Model: tabs-browse-item (container block, each child = one row)
 *   Fields:
 *     - title (text)              → Col 1
 *     - content_heading (text)    → Col 2 (grouped: content_*)
 *     - content_headingType (select) → SKIP (collapsed, ends with "Type")
 *     - content_image (reference) → Col 2 (grouped: content_*)
 *     - content_richtext (richtext) → Col 2 (grouped: content_*)
 *
 * DOM structure (slick slider):
 *   .category-tab span → tab labels (Heritage, Cruiser, Adventure, Roadster, Pure Sport)
 *   .motorcycle-carousel-bike-images img → bike images
 *   .motorcycle-carousel-bike-names h2 → bike names
 *   .cta-box a → CTAs (Know More, Configure Now, Book a Test Ride)
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract unique category names from category-tab divs directly
  // Note: Helix Importer strips <span> tags, so use .category-tab textContent
  const allCategoryTabs = element.querySelectorAll('.category-tab');
  const categoryNames = [];
  allCategoryTabs.forEach((tab) => {
    const name = tab.textContent.trim();
    if (name && !categoryNames.includes(name)) {
      categoryNames.push(name);
    }
  });

  // Get ALL bike images and names, deduplicate by alt text / text content
  const allBikeImgEls = element.querySelectorAll('.motorcycle-carousel-bike-images img');
  const bikeImages = [];
  const seenImgAlts = [];
  allBikeImgEls.forEach((img) => {
    const alt = img.getAttribute('alt') || '';
    if (alt && !seenImgAlts.includes(alt)) {
      seenImgAlts.push(alt);
      bikeImages.push(img);
    }
  });

  const allBikeNameEls = element.querySelectorAll('.motorcycle-carousel-bike-names h2');
  const bikeNames = [];
  const seenNames = [];
  allBikeNameEls.forEach((h2) => {
    const name = h2.textContent.trim();
    if (name && !seenNames.includes(name)) {
      seenNames.push(name);
      bikeNames.push(h2);
    }
  });

  // Get CTAs
  const ctaBox = element.querySelector('.cta-box');
  const ctas = ctaBox ? ctaBox.querySelectorAll('a') : [];

  if (categoryNames.length > 0) {
    // Create one row per category
    categoryNames.forEach((catName, idx) => {
      // Col 1: title
      const titleFrag = document.createDocumentFragment();
      titleFrag.appendChild(document.createComment(' field:title '));
      const titleEl = document.createElement('p');
      titleEl.textContent = catName;
      titleFrag.appendChild(titleEl);

      // Col 2: content_heading + content_image + content_richtext (grouped)
      const contentFrag = document.createDocumentFragment();

      // content_heading: use the first bike name as representative heading
      contentFrag.appendChild(document.createComment(' field:content_heading '));
      if (bikeNames.length > idx) {
        const headingEl = document.createElement('h3');
        headingEl.textContent = bikeNames[idx] ? bikeNames[idx].textContent.trim() : catName;
        contentFrag.appendChild(headingEl);
      }

      // content_image: use corresponding bike image
      contentFrag.appendChild(document.createComment(' field:content_image '));
      if (bikeImages.length > idx && bikeImages[idx]) {
        contentFrag.appendChild(bikeImages[idx].cloneNode(true));
      }

      // content_richtext: CTAs shared across tabs
      contentFrag.appendChild(document.createComment(' field:content_richtext '));
      if (ctas.length > 0) {
        const p = document.createElement('p');
        ctas.forEach((cta) => {
          const clonedLink = cta.cloneNode(true);
          p.appendChild(clonedLink);
          p.appendChild(document.createTextNode(' '));
        });
        contentFrag.appendChild(p);
      }

      cells.push([titleFrag, contentFrag]);
    });
  } else {
    // Fallback: create a single tab from available content
    const titleFrag = document.createDocumentFragment();
    titleFrag.appendChild(document.createComment(' field:title '));
    const titleEl = document.createElement('p');
    titleEl.textContent = 'Motorcycles';
    titleFrag.appendChild(titleEl);

    const contentFrag = document.createDocumentFragment();

    // content_heading (even if empty, hint must be present)
    contentFrag.appendChild(document.createComment(' field:content_heading '));

    // content_image
    contentFrag.appendChild(document.createComment(' field:content_image '));
    const firstImg = element.querySelector('.motorcycle-carousel-bike-images img, img');
    if (firstImg) contentFrag.appendChild(firstImg);

    // content_richtext
    contentFrag.appendChild(document.createComment(' field:content_richtext '));
    const links = element.querySelectorAll('.cta-box a, a.know-more-cta, a.goldenButton');
    if (links.length > 0) {
      const p = document.createElement('p');
      links.forEach((link) => p.appendChild(link));
      contentFrag.appendChild(p);
    }

    cells.push([titleFrag, contentFrag]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-browse', cells });
  element.replaceWith(block);
}
