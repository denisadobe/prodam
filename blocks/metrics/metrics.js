import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Metrics block: each authored row is one metric.
 * Row layout is flexible — an icon/image cell plus a text cell that holds the
 * big number (a heading or <strong>) and a label. Cells may be omitted.
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'metrics-item';

    [...row.children].forEach((cell) => {
      const pic = cell.querySelector('picture');
      const icon = cell.querySelector('.icon');
      if ((pic || icon) && cell.textContent.trim() === '') {
        cell.className = 'metrics-icon';
      } else {
        cell.className = 'metrics-body';
        // Promote a bare number paragraph to the emphasised value.
        const strong = cell.querySelector('strong');
        if (strong && !cell.querySelector('.metrics-value')) {
          strong.closest('p')?.classList.add('metrics-value');
        }
      }
      li.append(cell);
    });

    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => img
    .closest('picture')
    .replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '150' }])));

  block.replaceChildren(ul);
}
