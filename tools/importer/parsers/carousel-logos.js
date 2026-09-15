/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-logos (case / recognition logo strip).
 * Base: carousel. Source: https://portal.prodam.sp.gov.br/
 * 2 columns. Each logo tile -> one row: [linked image | caption/name text].
 * The logo image keeps its link href; caption falls back to the image alt.
 */
export default function parse(element, { document }) {
  const slides = Array.from(element.querySelectorAll('.swiper-slide'));

  const cells = [];

  slides.forEach((slide) => {
    const img = slide.querySelector('img');
    if (!img) return;

    const link = slide.querySelector('a[href]');

    // Keep the link wrapping the logo image.
    let imageContent = img;
    if (link) {
      const a = document.createElement('a');
      a.setAttribute('href', link.getAttribute('href'));
      a.append(img);
      imageContent = a;
    }

    // Caption: explicit caption text if present, else the image alt.
    const captionEl = slide.querySelector('figcaption, [class*="caption"], [class*="title"], [class*="name"]');
    let captionText = captionEl ? captionEl.textContent.replace(/\s+/g, ' ').trim() : '';
    if (!captionText && img.getAttribute('alt')) {
      captionText = img.getAttribute('alt').trim();
    }

    const captionCell = [];
    if (captionText) {
      const p = document.createElement('p');
      p.textContent = captionText;
      captionCell.push(p);
    }

    // Row: image cell + caption cell (2-column carousel).
    cells.push([imageContent, captionCell]);
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
