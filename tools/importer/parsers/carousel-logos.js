/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-logos (case / recognition logo strip).
 * Base: carousel. Source: https://portal.prodam.sp.gov.br/
 * 1 column. Each logo tile -> one row: [linked logo image].
 * No visible caption — the source shows only the logo (the name lives in a
 * screen-reader-only span), so the name is preserved on the image `alt`/link
 * title for accessibility, not rendered as a visible label.
 */
export default function parse(element, { document }) {
  const slides = Array.from(element.querySelectorAll('.swiper-slide'));

  const cells = [];

  slides.forEach((slide) => {
    const img = slide.querySelector('img');
    if (!img) return;

    const link = slide.querySelector('a[href]');

    // Ensure the logo name survives as the image alt (source keeps it sr-only).
    if (!img.getAttribute('alt')) {
      const srName = slide.querySelector('.sr-only, [class*="title"], [class*="name"]');
      if (srName) img.setAttribute('alt', srName.textContent.replace(/\s+/g, ' ').trim());
    }

    // Keep the link wrapping the logo image; carry the name as the link title.
    let imageContent = img;
    if (link) {
      const a = document.createElement('a');
      a.setAttribute('href', link.getAttribute('href'));
      if (img.getAttribute('alt')) a.setAttribute('title', img.getAttribute('alt'));
      a.append(img);
      imageContent = a;
    }

    // Row: single cell with the linked logo (no visible caption).
    cells.push([imageContent]);
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Reuse the existing carousel block via its "logos" variant (EDS class: carousel logos).
  const block = WebImporter.Blocks.createBlock(document, { name: 'Carousel (logos)', cells });

  // Preserve the section heading (e.g. "CASES", "Reconhecimentos") as default content above the block.
  const heading = element.querySelector('h1, h2');
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.replace(/\s+/g, ' ').trim();
    element.replaceWith(h2, block);
  } else {
    element.replaceWith(block);
  }
}
