/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns (featured "Soluções Prodam" solution).
 * Base: columns. Source: https://portal.prodam.sp.gov.br/
 * Two-column layout: text + CTAs in one cell, image in the other.
 * One row, two cells.
 */
export default function parse(element, { document }) {
  const highlight = element.querySelector('.prodam-image-text-highlight') || element;

  // Image: the primary (non-mobile) image.
  const img = highlight.querySelector(':scope > img, img');

  // Text side: overline heading, title, description, CTAs.
  const overline = highlight.querySelector('h2');
  const title = highlight.querySelector('[class*="--text--title"], h3');
  const description = highlight.querySelector('[class*="--text--description"]');
  const ctaButton = highlight.querySelector('[class*="__bottom"] > a[href]');
  const linkPara = highlight.querySelector('[class*="__bottom--text"]');

  const textCell = [];
  if (overline) textCell.push(overline);
  if (title) textCell.push(title);
  if (description) textCell.push(description);
  if (ctaButton) {
    // Normalize the button anchor to plain linked text.
    const a = document.createElement('a');
    a.setAttribute('href', ctaButton.getAttribute('href'));
    a.textContent = ctaButton.textContent.replace(/\s+/g, ' ').trim();
    const p = document.createElement('p');
    p.append(a);
    textCell.push(p);
  }
  if (linkPara) textCell.push(linkPara);

  const imageCell = [];
  if (img) imageCell.push(img);

  if (textCell.length === 0 && imageCell.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // One row, two columns: [text | image]
  const cells = [[textCell, imageCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
  element.replaceWith(block);
}
