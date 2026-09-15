import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // Load the footer fragment: /content first (localhost), then root (DA/EDS production).
  const fragment = await loadFragment('/content/footer') || await loadFragment('/footer');
  if (!fragment) return;

  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  const cols = [...footer.children];
  // First divs form the upper band (contact/social, logos); last div is the copyright bar.
  const upper = document.createElement('div');
  upper.className = 'footer-upper';
  cols.slice(0, Math.max(1, cols.length - 1)).forEach((col, i) => {
    col.classList.add(i === 0 ? 'footer-contact' : 'footer-brand');
    upper.append(col);
  });

  const bar = cols[cols.length - 1];
  if (bar) bar.classList.add('footer-copyright');

  // Tag the social list (the list whose items contain images).
  upper.querySelectorAll('ul').forEach((ul) => {
    if (ul.querySelector('img')) ul.classList.add('footer-social');
  });

  block.textContent = '';
  block.append(upper);
  if (bar) block.append(bar);
}
