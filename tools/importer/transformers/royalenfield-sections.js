/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Royal Enfield sections.
 * Adds section breaks and section-metadata blocks from template sections.
 * Runs in afterTransform only.
 * Selectors from captured DOM of https://www.royalenfield.com/in/en/home/
 */
const H = { after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.after) {
    const { template } = payload;
    if (!template || !template.sections || template.sections.length < 2) return;

    const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
    const doc = element.ownerDocument || document;

    // Process sections in reverse order to preserve DOM positions
    const sections = [...template.sections].reverse();

    sections.forEach((section) => {
      // Find the section element using the selector
      let sectionEl;
      if (Array.isArray(section.selector)) {
        for (const sel of section.selector) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
      } else {
        sectionEl = element.querySelector(section.selector);
      }

      if (!sectionEl) return;

      // Add section-metadata block if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(doc, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(sectionMetadata);
      }

      // Add section break (hr) before each section except the first
      if (section.id !== template.sections[0].id) {
        const hr = doc.createElement('hr');
        sectionEl.before(hr);
      }
    });
  }
}
