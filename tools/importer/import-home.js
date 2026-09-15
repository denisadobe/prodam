/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselParser from './parsers/carousel.js';
import carouselLogosParser from './parsers/carousel-logos.js';
import cardsParser from './parsers/cards.js';
import columnsParser from './parsers/columns.js';
import metricsParser from './parsers/metrics.js';
import heroParser from './parsers/hero.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/prodam-cleanup.js';
import sectionsTransformer from './transformers/prodam-sections.js';

// PARSER REGISTRY
const parsers = {
  carousel: carouselParser,
  'carousel-logos': carouselLogosParser,
  cards: cardsParser,
  columns: columnsParser,
  metrics: metricsParser,
  hero: heroParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'home',
  description: 'Prodam homepage: hero carousel, intro, promo banners, news cards, featured solution, infrastructure metrics, and case/recognition logo carousels.',
  urls: [
    'https://portal.prodam.sp.gov.br/',
  ],
  blocks: [
    {
      name: 'carousel',
      section: 'hero',
      instances: [
        '#main-content > div.prodam-content-wrapper > div.lfr-layout-structure-item-85d01537-1edb-8f00-8618-0e62d30dff01',
      ],
    },
    {
      name: 'hero',
      instances: [
        'div.lfr-layout-structure-item-494206e1-b609-35e6-b79d-5ec15c472fc6',
        '#main-content > div.prodam-content-wrapper > div.lfr-layout-structure-item-3856fe77-db28-d7df-2a15-3f834543be3d',
      ],
    },
    {
      name: 'cards',
      section: 'news',
      instances: [
        '#main-content > div.prodam-content-wrapper > div.lfr-layout-structure-item-6ea6111e-9778-303a-636b-2ede4697f3df',
      ],
    },
    {
      name: 'columns',
      instances: [
        '#main-content > div.prodam-content-wrapper > div.lfr-layout-structure-item-e3778100-38db-c106-1f66-5dae4215d9a5',
      ],
    },
    {
      name: 'metrics',
      instances: [
        '#main-content > div.prodam-content-wrapper > div.lfr-layout-structure-item-69e49c8e-35de-d479-5a9e-1d3ccdb870f1',
      ],
    },
    {
      name: 'carousel-logos',
      section: 'logos',
      instances: [
        'div.lfr-layout-structure-item-b0f2d400-2858-9039-1201-93586ad7c6ce',
        '#main-content > div.prodam-content-wrapper > div.lfr-layout-structure-item-0df630be-f196-1254-9d3c-f57f54f8a8bd',
      ],
    },
  ],
  sections: [
    {
      id: 'rc1c2c1',
      name: 'Hero image carousel',
      selector: ['#main-content > div.prodam-content-wrapper > div.lfr-layout-structure-item-85d01537-1edb-8f00-8618-0e62d30dff01'],
      style: null,
    },
    {
      id: 'rc1c2c2',
      name: 'Intro - Ola, eu sou a Prodam',
      selector: ['#main-content > div.prodam-content-wrapper > div.lfr-layout-structure-item-4189807c-b023-6b18-772e-5022ba28c498'],
      style: 'centered',
    },
    {
      id: 'rc1c2c3',
      name: 'Prodam Store promo banner',
      selector: ['div.lfr-layout-structure-item-494206e1-b609-35e6-b79d-5ec15c472fc6', '#fmvm'],
      style: null,
    },
    {
      id: 'rc1c2c5',
      name: 'Noticias news cards',
      selector: ['#main-content > div.prodam-content-wrapper > div.lfr-layout-structure-item-6ea6111e-9778-303a-636b-2ede4697f3df'],
      style: null,
    },
    {
      id: 'rc1c2c7',
      name: 'Solucoes Prodam featured solution',
      selector: ['#main-content > div.prodam-content-wrapper > div.lfr-layout-structure-item-e3778100-38db-c106-1f66-5dae4215d9a5'],
      style: 'light',
    },
    {
      id: 'rc1c2c8',
      name: 'Infraestrutura Prodam metrics',
      selector: ['#main-content > div.prodam-content-wrapper > div.lfr-layout-structure-item-69e49c8e-35de-d479-5a9e-1d3ccdb870f1'],
      style: null,
    },
    {
      id: 'rc1c2c9',
      name: 'Smart-city / ISO recognition banner',
      selector: ['#main-content > div.prodam-content-wrapper > div.lfr-layout-structure-item-3856fe77-db28-d7df-2a15-3f834543be3d'],
      style: null,
    },
    {
      id: 'rc1c2c10',
      name: 'Cases logo carousel',
      selector: ['div.lfr-layout-structure-item-b0f2d400-2858-9039-1201-93586ad7c6ce', '#uhht'],
      style: 'light',
    },
    {
      id: 'rc1c2c11',
      name: 'Reconhecimentos logo carousel',
      selector: ['#main-content > div.prodam-content-wrapper > div.lfr-layout-structure-item-0df630be-f196-1254-9d3c-f57f54f8a8bd'],
      style: 'navy',
    },
  ],
};

// TRANSFORMER REGISTRY - cleanup first, then section breaks/metadata
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook.
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration.
 * Only the first matching instance per block is used to avoid duplicate parses
 * when several fallback selectors resolve to the same element.
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  const seen = new Set();

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      let elements = [];
      try {
        elements = [...document.querySelectorAll(selector)];
      } catch (e) {
        console.warn(`Invalid selector for "${blockDef.name}": ${selector}`);
      }
      elements.forEach((element) => {
        if (seen.has(element)) return;
        seen.add(element);
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
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform cleanup
    executeTransformers('beforeTransform', main, payload);

    // 2. Discover blocks
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block, skipping any element already replaced
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
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

    // 4. afterTransform cleanup + section breaks/metadata
    executeTransformers('afterTransform', main, payload);

    // 5. Built-in importer rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Sanitized path (root maps to /index to avoid empty-path crash)
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

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
