/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero (single full-width clickable promo banner).
 * Base: hero. Source: https://portal.prodam.sp.gov.br/
 * 1 column. A single linked banner image; keep the link wrapping the image.
 */
export default function parse(element, { document }) {
  const img = element.querySelector('img');
  const link = element.querySelector('a[href]');

  if (!img && !link) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Preserve the link wrapping the image when present.
  let imageContent = img;
  if (link && img) {
    const a = document.createElement('a');
    a.setAttribute('href', link.getAttribute('href'));
    a.append(img);
    imageContent = a;
  } else if (link && !img) {
    imageContent = link;
  }

  // Hero: 1 column. Row 2 holds the (linked) banner image.
  const cells = [[imageContent]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
  element.replaceWith(block);
}
