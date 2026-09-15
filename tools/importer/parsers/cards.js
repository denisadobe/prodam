/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards (news variant).
 * Base: cards. Source: https://portal.prodam.sp.gov.br/
 * 2 columns. Each news card -> one row: [image | body].
 * Body: category tag, date, linked title heading, excerpt paragraph, read-more link.
 */
export default function parse(element, { document }) {
  const cards = Array.from(element.querySelectorAll('.prodam-generic-card'));

  const cells = [];

  cards.forEach((card) => {
    const img = card.querySelector('img');

    const category = card.querySelector('[class*="__category"]');
    const date = card.querySelector('[class*="__data-publication"]');
    const title = card.querySelector('h3, [class*="__title"]');
    const titleLink = title ? title.closest('a[href]') : null;
    const excerpt = card.querySelector('[class*="__txt-wrapper"], [class*="__description"]');
    const readMore = card.querySelector('[class*="__read-more"] a[href]');

    const body = [];

    // Category + date metadata as short paragraphs.
    if (category && category.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = category.textContent.trim();
      body.push(p);
    }
    if (date && date.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = date.textContent.trim();
      body.push(p);
    }

    // Title as a linked heading.
    if (title) {
      const h3 = document.createElement('h3');
      const titleText = title.textContent.replace(/\s+/g, ' ').trim();
      const href = titleLink ? titleLink.getAttribute('href') : null;
      if (href) {
        const a = document.createElement('a');
        a.setAttribute('href', href);
        a.textContent = titleText;
        h3.append(a);
      } else {
        h3.textContent = titleText;
      }
      body.push(h3);
    }

    // Excerpt paragraph.
    if (excerpt && excerpt.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = excerpt.textContent.replace(/\s+/g, ' ').trim();
      body.push(p);
    }

    // Read-more link.
    if (readMore) {
      const a = document.createElement('a');
      a.setAttribute('href', readMore.getAttribute('href'));
      a.textContent = 'Leia mais';
      const p = document.createElement('p');
      p.append(a);
      body.push(p);
    }

    // Skip empty cards (no title and no excerpt).
    if (body.length === 0) return;

    // Row: image cell + body cell (2-column cards).
    cells.push([img || '', body]);
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Use the cards "news" variant (EDS class: cards news).
  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards (news)', cells });

  // Preserve the section heading (e.g. "Notícias") as default content above the block.
  const heading = element.querySelector('h1, h2');
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.replace(/\s+/g, ' ').trim();
    element.replaceWith(h2, block);
  } else {
    element.replaceWith(block);
  }
}
