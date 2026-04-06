/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Royal Enfield cleanup.
 * Selectors from captured DOM of https://www.royalenfield.com/in/en/home/
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove cookie consent and overlay elements (from captured DOM)
    WebImporter.DOMUtils.remove(element, [
      '.cookie-banners--revamp',
      '.re-page-loader',
      '#pageLoader',
      '.motoverse-banner',
      '.loading-ellipsis',
      '.re-revamp-v4-header__header-backdrop-transparent',
    ]);

    // Fix overflow hidden on body that blocks scrolling
    if (element.style && element.style.overflow === 'hidden') {
      element.style.overflow = 'scroll';
    }
  }

  if (hookName === H.after) {
    // Remove non-authorable content: header, footer, nav, sidebars
    WebImporter.DOMUtils.remove(element, [
      '.cmp-experiencefragment--header',
      '.re-revamp-v4-header',
      'header',
      '.footer',
      'footer',
      '.cmp-experiencefragment--footer',
      'nav',
      'link',
      'noscript',
      'iframe',
      '.pageloader',
      '.re__revamp-v4__section__login',
      '.country-toast',
      '.re-country-selector',
      '.scrolltoexplore',
      'source',
    ]);

    // Remove tracking and unnecessary attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-cmp-data-layer');
      el.removeAttribute('data-cmp-link-accessibility-enabled');
      el.removeAttribute('data-cmp-link-accessibility-text');
      el.removeAttribute('onclick');
      el.removeAttribute('data-track');
    });
  }
}
