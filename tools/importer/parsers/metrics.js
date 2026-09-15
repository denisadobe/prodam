/* eslint-disable */
/* global WebImporter */
/**
 * Parser for metrics (infrastructure statistics).
 * Base: metrics (custom block — no library convention; structure derived from source).
 * 2 columns. Each stat -> one row: [icon/image | text].
 * Text cell holds the big number (as strong/heading) plus its label.
 */
export default function parse(element, { document }) {
  const stats = Array.from(element.querySelectorAll('.prodam-number-display'));

  const cells = [];

  stats.forEach((stat) => {
    const icon = stat.querySelector('[class*="__svg"] img, img');

    const number = stat.querySelector('[class*="--size-xl"] strong, strong');
    // Label is the smaller text next to the number.
    const labelEl = stat.querySelector('[class*="--size-sm"]');

    const numberText = number ? number.textContent.replace(/\s+/g, ' ').trim() : '';
    const labelText = labelEl ? labelEl.textContent.replace(/\s+/g, ' ').trim() : '';

    if (!numberText && !labelText) return;

    const textCell = [];
    if (numberText) {
      const h3 = document.createElement('h3');
      const strong = document.createElement('strong');
      strong.textContent = numberText;
      h3.append(strong);
      textCell.push(h3);
    }
    if (labelText) {
      const p = document.createElement('p');
      p.textContent = labelText;
      textCell.push(p);
    }

    // Row: icon cell + text cell (2-column metrics).
    cells.push([icon || '', textCell]);
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'metrics', cells });

  // Preserve the section heading (e.g. "INFRAESTRUTURA PRODAM") as default content above the block.
  const heading = element.querySelector('h1, h2');
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.replace(/\s+/g, ' ').trim();
    element.replaceWith(h2, block);
  } else {
    element.replaceWith(block);
  }
}
