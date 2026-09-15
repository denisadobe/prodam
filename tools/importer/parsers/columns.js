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
    // Emphasise the CTA so decorateButtons renders it as a button (strong = primary).
    const a = document.createElement('a');
    a.setAttribute('href', ctaButton.getAttribute('href'));
    a.textContent = ctaButton.textContent.replace(/\s+/g, ' ').trim();
    const strong = document.createElement('strong');
    strong.append(a);
    const p = document.createElement('p');
    p.append(strong);
    textCell.push(p);
  }
  if (linkPara) textCell.push(linkPara);

  const imageCell = [];
  if (img) {
    imageCell.push(img);
  } else {
    // Source renders the illustration as a rotating/background image not captured
    // on scrape — use the representative "arte4" solutions illustration.
    const fallback = document.createElement('img');
    fallback.src = 'https://portal.prodam.sp.gov.br/documents/20118/200075/arte4.png/fd448bcc-6b28-2cc7-9e19-438bfefdea15?t=1700575115254';
    fallback.alt = 'Soluções Prodam';
    imageCell.push(fallback);
  }

  if (textCell.length === 0 && imageCell.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // One row, two columns: [text | image] — "solution" variant for richer styling.
  const cells = [[textCell, imageCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns (solution)', cells });
  element.replaceWith(block);
}
