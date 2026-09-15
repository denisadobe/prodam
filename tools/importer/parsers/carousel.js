/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel (hero image carousel variant).
 * Base: carousel. Source: https://portal.prodam.sp.gov.br/
 * Full-bleed image slides; each slide -> one row: [image | overlaid heading text].
 *
 * The live page renders each slide's photo as a CSS background-image declared in a
 * <style> block (`#prodam-mega-banner-item-XXX { background: url(...) }`), so image
 * URLs are recovered from those rules and paired with slides in document order.
 */
export default function parse(element, { document }) {
  // Collect background image URLs from the block's <style> rules, in order.
  const styleText = [...element.querySelectorAll('style')]
    .map((s) => s.textContent || '')
    .join('\n');
  const bgUrls = [];
  const re = /background\s*:\s*url\((['"]?)(.*?)\1\)/gi;
  let m;
  while ((m = re.exec(styleText)) !== null) {
    if (m[2]) bgUrls.push(m[2].trim());
  }

  // Slides (dedupe swiper loop clones by title text).
  const allSlides = [...element.querySelectorAll('.swiper-slide')];
  const seenTitles = new Set();
  const slides = [];
  allSlides.forEach((slide) => {
    const t = (slide.querySelector('[class*="--title"]')?.textContent || slide.textContent || '').trim();
    const key = t.slice(0, 40);
    if (key && seenTitles.has(key)) return;
    if (key) seenTitles.add(key);
    slides.push(slide);
  });

  const cells = [];

  slides.forEach((slide, idx) => {
    let img = slide.querySelector('img');
    if (!img) {
      // Recover the slide photo from an inline style url() or the <style> rules.
      const bgEl = [slide, ...slide.querySelectorAll('*')]
        .find((el) => /url\(/i.test((el.getAttribute && el.getAttribute('style')) || ''));
      const im = bgEl && bgEl.getAttribute('style').match(/url\((['"]?)(.*?)\1\)/i);
      const src = (im && im[2]) || bgUrls[idx];
      if (src) {
        img = document.createElement('img');
        img.src = src;
      }
    }

    const titleEl = slide.querySelector('[class*="--title"]');
    const subtitleEl = slide.querySelector('[class*="--subtitle"]');

    const contentCell = [];
    const titleText = titleEl ? titleEl.textContent.trim() : '';
    const subtitleText = subtitleEl ? subtitleEl.textContent.trim() : '';

    if (titleText) {
      const h2 = document.createElement('h2');
      h2.textContent = titleText;
      contentCell.push(h2);
    }
    if (subtitleText) {
      const p = document.createElement('p');
      p.textContent = subtitleText;
      contentCell.push(p);
    }

    // Skip a slide that yielded neither an image nor text.
    if (!img && contentCell.length === 0) return;

    cells.push([img || '', contentCell]);
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel', cells });
  element.replaceWith(block);
}
