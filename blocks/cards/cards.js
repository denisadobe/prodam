import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));

  // News variant: tag the excerpt and the "read more" link for styling.
  if (block.classList.contains('news')) {
    ul.querySelectorAll('.cards-card-body').forEach((body) => {
      const paras = [...body.querySelectorAll(':scope > p')];
      // last standalone link paragraph becomes the read-more affordance
      const last = paras[paras.length - 1];
      const lastLink = last?.querySelector('a');
      if (lastLink && last.textContent.trim() === lastLink.textContent.trim()) {
        lastLink.classList.add('readmore');
      }
      // the longest text paragraph is treated as the excerpt
      const textParas = paras.filter((p) => !p.querySelector('a') && p.textContent.trim());
      const excerpt = textParas.sort((a, b) => b.textContent.length - a.textContent.length)[0];
      if (excerpt) excerpt.classList.add('cards-excerpt');
    });
  }

  block.replaceChildren(ul);
}
