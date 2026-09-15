import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Concentric-ring SVG shown behind each metric value, echoing the reference's
 * animated number displays (dashed outer ring + solid inner ring + accent arc).
 * @returns {string} inline SVG markup
 */
function ringSVG() {
  return `<svg class="metrics-ring" viewBox="0 0 225 226" fill="none" aria-hidden="true" focusable="false">
    <circle cx="112.5" cy="113" r="111.5" stroke="#d8d8d8" stroke-width="2" stroke-dasharray="11 13 15 17" fill="none"/>
    <circle cx="112.5" cy="113" r="89.5" stroke="#a1a1a1" stroke-width="3" fill="none"/>
    <path d="M203 113C203 62.7 162.3 22 112 22" stroke="var(--prodam-orange, #ff671d)" stroke-width="4" stroke-linecap="round" fill="none"/>
  </svg>`;
}

/**
 * Metrics block: each authored row is one metric.
 * Row layout is flexible — an optional icon/image cell plus a text cell that
 * holds the big number (a heading or <strong>) and a label. When no icon image
 * was captured, the value is framed by a concentric-ring SVG (reference style).
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'metrics-item';

    [...row.children].forEach((cell) => {
      const pic = cell.querySelector('picture');
      const hasText = cell.textContent.trim() !== '';
      if (pic && !hasText) {
        // real captured icon image
        cell.className = 'metrics-icon';
        li.append(cell);
      } else if (hasText) {
        cell.className = 'metrics-body';
        const strong = cell.querySelector('strong');
        if (strong && !cell.querySelector('.metrics-value')) {
          strong.closest('p')?.classList.add('metrics-value');
        }
        li.append(cell);
      }
      // empty leftover cell (icon was an inline SVG, not captured) is dropped
    });

    // Frame the value with the ring: move the number into a circular container
    // overlaying the SVG. Pick the body that actually holds the number.
    const body = [...li.querySelectorAll('.metrics-body')]
      .find((b) => b.querySelector('h1, h2, h3, .metrics-value, strong'));
    if (body) {
      const valueEl = body.querySelector('h1, h2, h3, .metrics-value, strong');
      if (valueEl) {
        const ring = document.createElement('div');
        ring.className = 'metrics-ring-wrap';
        ring.innerHTML = ringSVG();
        const num = document.createElement('span');
        num.className = 'metrics-number';
        num.textContent = valueEl.textContent.trim();
        ring.append(num);
        // replace the original value node with the ring; keep the label
        const valueBlock = valueEl.closest('p') || valueEl;
        valueBlock.replaceWith(ring);
        body.prepend(ring);
      }
    }

    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => img
    .closest('picture')
    .replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '150' }])));

  block.replaceChildren(ul);
}
