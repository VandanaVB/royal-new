/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroShowcaseParser from './parsers/hero-showcase.js';
import cardsDarkParser from './parsers/cards-dark.js';
import tabsBrowseParser from './parsers/tabs-browse.js';
import carouselLegacyParser from './parsers/carousel-legacy.js';
import columnsLocateParser from './parsers/columns-locate.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/royalenfield-cleanup.js';
import sectionsTransformer from './transformers/royalenfield-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-showcase': heroShowcaseParser,
  'cards-dark': cardsDarkParser,
  'tabs-browse': tabsBrowseParser,
  'carousel-legacy': carouselLegacyParser,
  'columns-locate': columnsLocateParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Royal Enfield India homepage with hero banners, product showcases, and brand content',
  urls: [
    'https://www.royalenfield.com/in/en/home/'
  ],
  blocks: [
    {
      name: 'hero-showcase',
      instances: ['.homeherobanner']
    },
    {
      name: 'cards-dark',
      instances: ['.herostripe', '.motoculture', '.iridegrid', '.royal-enfield-shop-us']
    },
    {
      name: 'tabs-browse',
      instances: ['.motorcyclewithcategories']
    },
    {
      name: 'carousel-legacy',
      instances: ['.swipercarousel.swiper-container--legacy']
    },
    {
      name: 'columns-locate',
      instances: ['.locateservicecentrecard']
    }
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Banner',
      selector: '.homeherobanner',
      style: null,
      blocks: ['hero-showcase'],
      defaultContent: []
    },
    {
      id: 'section-2',
      name: 'In the Headlights',
      selector: '.herostripe',
      style: 'dark',
      blocks: ['cards-dark'],
      defaultContent: ['h2']
    },
    {
      id: 'section-3',
      name: 'Motorcycles',
      selector: '.motorcyclewithcategories',
      style: 'dark',
      blocks: ['tabs-browse'],
      defaultContent: ['h2']
    },
    {
      id: 'section-4',
      name: 'Motoculture',
      selector: '.motoculture',
      style: 'dark',
      blocks: ['cards-dark'],
      defaultContent: ['h2']
    },
    {
      id: 'section-5',
      name: 'iRide Events',
      selector: '.iridegrid',
      style: 'dark',
      blocks: ['cards-dark'],
      defaultContent: []
    },
    {
      id: 'section-6',
      name: 'Legacy since 1901',
      selector: '.swipercarousel.swiper-container--legacy',
      style: 'dark',
      blocks: ['carousel-legacy'],
      defaultContent: ['h2']
    },
    {
      id: 'section-7',
      name: 'Locate Us',
      selector: '.locateservicecentrecard',
      style: 'dark',
      blocks: ['columns-locate'],
      defaultContent: []
    },
    {
      id: 'section-8',
      name: 'Shop',
      selector: '.royal-enfield-shop-us',
      style: 'dark',
      blocks: ['cards-dark'],
      defaultContent: ['h2']
    }
  ]
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    // 1. Execute beforeTransform transformers
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
