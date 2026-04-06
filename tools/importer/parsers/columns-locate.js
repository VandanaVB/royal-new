/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-locate. Base: columns.
 * Source: https://www.royalenfield.com/in/en/home/
 * Selector: .locateservicecentrecard
 * Columns blocks do NOT require field hints (per hinting.md Rule 4 exception).
 * Block library: N cols per row. Each cell = default content.
 */
export default function parse(element, { document }) {
  // Left column: heading + description + link
  const leftCol = document.createDocumentFragment();

  const heading = element.querySelector('.locate-centre__card-head, h3, h2');
  if (heading) leftCol.appendChild(heading);

  const desc = element.querySelector('.locate-centre__card-desc, p');
  if (desc) leftCol.appendChild(desc);

  const link = element.querySelector('.locate-centre__card-lh a, a.button, a');
  if (link) leftCol.appendChild(link);

  // Right column: location search description
  const rightCol = document.createDocumentFragment();

  const label = element.querySelector('.locate-centre__field-label, label');
  if (label) {
    const p = document.createElement('p');
    p.textContent = label.textContent.trim();
    rightCol.appendChild(p);
  }

  const locateIcon = element.querySelector('.locate-centre__locate-icon, img[alt="Locate Us"]');
  if (locateIcon) rightCol.appendChild(locateIcon);

  const cells = [[leftCol, rightCol]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-locate', cells });
  element.replaceWith(block);
}
