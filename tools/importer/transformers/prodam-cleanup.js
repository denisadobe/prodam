/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Prodam site-wide cleanup.
 *
 * Removes non-authorable site chrome (Liferay shell) so the import contains
 * only page-level authorable content. Every selector below was verified by
 * reading migration-work/cleaned.html (line references in comments).
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    WebImporter.DOMUtils.remove(element, [
      // Liferay cookie consent banner (cleaned.html:1519 .cookies-banner)
      '.cookies-banner',
      // Hand Talk accessibility widget overlay (cleaned.html:1553 .ht-skip)
      '.ht-skip',
      // Hand Talk plugin fragment inside content (cleaned.html:1371 .lfr-layout-structure-item-hand-talk)
      '.lfr-layout-structure-item-hand-talk',
      '.prodam-handTalk-plugin',
      // Liferay runtime/editor-only chrome (cleaned.html:1547, 1549, 1551)
      '.lfr-spa-loading-bar',
      '#tooltipContainer',
      '#yui3-css-stamp',
      // Editor-only helper alerts, e.g. Menu de Acessibilidade / Scripts (cleaned.html:271, 280, 1374)
      '.page-editor-only',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    WebImporter.DOMUtils.remove(element, [
      // "Pular para o Conteudo principal" skip-link nav (cleaned.html:3 #lihm_quickAccessNav)
      '#lihm_quickAccessNav',
      // Site header incl. top menu, main nav, search (cleaned.html:16 header.prodam-header)
      'header',
      '.lfr-layout-structure-item-cabe-alho',
      // Accessibility tools menu (cleaned.html:227 .prodam-accessibility-menu / :225 wrapper)
      '.prodam-accessibility-menu',
      '.lfr-layout-structure-item-accessibility-menu',
      // Scripts/"conteudo-principal" anchor fragment ONLY (cleaned.html:277 wrapper #a7e98985).
      // NOTE: the bare .lfr-layout-structure-item-basic-component-html class is also used by the
      // authorable news cards (cleaned.html:444/482/520 with UUID 3c4ef7b4), so target the specific
      // Scripts wrapper UUID instead of the shared class to avoid removing card content.
      '.lfr-layout-structure-item-a7e98985-ecf5-e998-243d-e7751c243669',
      // Site footer (cleaned.html:1382 footer.prodam-footer-institutional / :1380 wrapper)
      'footer',
      '.lfr-layout-structure-item-rodape',
      // Hidden helper form (cleaned.html:1511 form#hrefFm)
      '#hrefFm',
      // Non-authorable leftover elements
      'iframe',
      'link',
      'noscript',
    ]);
  }
}
