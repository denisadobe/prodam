/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Prodam section breaks + Section Metadata.
 *
 * Inserts an <hr> before every non-first section and a "Section Metadata"
 * block after every section that carries a style. Section selectors come
 * from page-templates.json (all DOM-verified against migration-work/cleaned.html).
 *
 * Uses BOTH hooks: breaks are inserted in beforeTransform (while every section
 * element still exists, before parsers replace them), and metadata blocks are
 * inserted in afterTransform, anchored to a marker <hr> placed above each
 * styled section. Sections are processed in reverse so live-element inserts
 * never disturb positions not yet processed.
 */

const SECTION_MARKER_ATTR = 'data-excat-section-id';

// section.selector is an array of candidate selectors — try each in order, first match wins.
function querySection(root, selectors) {
  for (const sel of selectors) {
    const el = root.querySelector(sel);
    if (el) return el;
  }
  return null;
}

export default function transform(hookName, element, payload) {
  const sections = payload.template.sections || [];

  // A section needs metadata if it carries a style and/or a background image.
  const hasMeta = (s) => Boolean(s.style || s.background);

  if (hookName === 'beforeTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (i === 0 && !hasMeta(section)) continue; // first section: no leading break, no metadata
      const sectionEl = querySection(element, section.selector);
      if (!sectionEl) continue; // no selector matched on this page — skip, never guess

      const hr = document.createElement('hr');
      if (hasMeta(section)) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
      sectionEl.before(hr);
    }
  }

  if (hookName === 'afterTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!hasMeta(section)) continue;

      const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
      const anchor = marker || querySection(element, section.selector);
      if (!anchor) continue; // neither survived — no selector matched post-parse; skip, never guess

      const cells = {};
      if (section.style) cells.style = section.style;
      if (section.background) cells.background = section.background;
      const metadataBlock = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells,
      });
      anchor.after(metadataBlock);

      if (marker) {
        marker.removeAttribute(SECTION_MARKER_ATTR);
        if (i === 0) marker.remove(); // section 0 never gets a real leading break
      }
    }
  }
}
