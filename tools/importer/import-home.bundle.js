/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-home.js
  var import_home_exports = {};
  __export(import_home_exports, {
    default: () => import_home_default
  });

  // tools/importer/parsers/carousel.js
  function parse(element, { document: document2 }) {
    const styleText = [...element.querySelectorAll("style")].map((s) => s.textContent || "").join("\n");
    const bgUrls = [];
    const re = /background\s*:\s*url\((['"]?)(.*?)\1\)/gi;
    let m;
    while ((m = re.exec(styleText)) !== null) {
      if (m[2]) bgUrls.push(m[2].trim());
    }
    const allSlides = [...element.querySelectorAll(".swiper-slide")];
    const seenTitles = /* @__PURE__ */ new Set();
    const slides = [];
    allSlides.forEach((slide) => {
      var _a;
      const t = (((_a = slide.querySelector('[class*="--title"]')) == null ? void 0 : _a.textContent) || slide.textContent || "").trim();
      const key = t.slice(0, 40);
      if (key && seenTitles.has(key)) return;
      if (key) seenTitles.add(key);
      slides.push(slide);
    });
    const cells = [];
    slides.forEach((slide, idx) => {
      let img = slide.querySelector("img");
      if (!img) {
        const bgEl = [slide, ...slide.querySelectorAll("*")].find((el) => /url\(/i.test(el.getAttribute && el.getAttribute("style") || ""));
        const im = bgEl && bgEl.getAttribute("style").match(/url\((['"]?)(.*?)\1\)/i);
        const src = im && im[2] || bgUrls[idx];
        if (src) {
          img = document2.createElement("img");
          img.src = src;
        }
      }
      const titleEl = slide.querySelector('[class*="--title"]');
      const subtitleEl = slide.querySelector('[class*="--subtitle"]');
      const contentCell = [];
      const titleText = titleEl ? titleEl.textContent.trim() : "";
      const subtitleText = subtitleEl ? subtitleEl.textContent.trim() : "";
      if (titleText) {
        const h2 = document2.createElement("h2");
        h2.textContent = titleText;
        contentCell.push(h2);
      }
      if (subtitleText) {
        const p = document2.createElement("p");
        p.textContent = subtitleText;
        contentCell.push(p);
      }
      if (!img && contentCell.length === 0) return;
      cells.push([img || "", contentCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-logos.js
  function parse2(element, { document: document2 }) {
    const slides = Array.from(element.querySelectorAll(".swiper-slide"));
    const cells = [];
    slides.forEach((slide) => {
      const img = slide.querySelector("img");
      if (!img) return;
      const link = slide.querySelector("a[href]");
      let imageContent = img;
      if (link) {
        const a = document2.createElement("a");
        a.setAttribute("href", link.getAttribute("href"));
        a.append(img);
        imageContent = a;
      }
      const captionEl = slide.querySelector('figcaption, [class*="caption"], [class*="title"], [class*="name"]');
      let captionText = captionEl ? captionEl.textContent.replace(/\s+/g, " ").trim() : "";
      if (!captionText && img.getAttribute("alt")) {
        captionText = img.getAttribute("alt").trim();
      }
      const captionCell = [];
      if (captionText) {
        const p = document2.createElement("p");
        p.textContent = captionText;
        captionCell.push(p);
      }
      cells.push([imageContent, captionCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "Carousel (logos)", cells });
    const heading = element.querySelector("h1, h2");
    if (heading) {
      const h2 = document2.createElement("h2");
      h2.textContent = heading.textContent.replace(/\s+/g, " ").trim();
      element.replaceWith(h2, block);
    } else {
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/cards.js
  function parse3(element, { document: document2 }) {
    const cards = Array.from(element.querySelectorAll(".prodam-generic-card"));
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector("img");
      const category = card.querySelector('[class*="__category"]');
      const date = card.querySelector('[class*="__data-publication"]');
      const title = card.querySelector('h3, [class*="__title"]');
      const titleLink = title ? title.closest("a[href]") : null;
      const excerpt = card.querySelector('[class*="__txt-wrapper"], [class*="__description"]');
      const readMore = card.querySelector('[class*="__read-more"] a[href]');
      const body = [];
      if (category && category.textContent.trim()) {
        const p = document2.createElement("p");
        p.textContent = category.textContent.trim();
        body.push(p);
      }
      if (date && date.textContent.trim()) {
        const p = document2.createElement("p");
        p.textContent = date.textContent.trim();
        body.push(p);
      }
      if (title) {
        const h3 = document2.createElement("h3");
        const titleText = title.textContent.replace(/\s+/g, " ").trim();
        const href = titleLink ? titleLink.getAttribute("href") : null;
        if (href) {
          const a = document2.createElement("a");
          a.setAttribute("href", href);
          a.textContent = titleText;
          h3.append(a);
        } else {
          h3.textContent = titleText;
        }
        body.push(h3);
      }
      if (excerpt && excerpt.textContent.trim()) {
        const p = document2.createElement("p");
        p.textContent = excerpt.textContent.replace(/\s+/g, " ").trim();
        body.push(p);
      }
      if (readMore) {
        const a = document2.createElement("a");
        a.setAttribute("href", readMore.getAttribute("href"));
        a.textContent = "Leia mais";
        const p = document2.createElement("p");
        p.append(a);
        body.push(p);
      }
      if (body.length === 0) return;
      cells.push([img || "", body]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "Cards (news)", cells });
    const heading = element.querySelector("h1, h2");
    if (heading) {
      const h2 = document2.createElement("h2");
      h2.textContent = heading.textContent.replace(/\s+/g, " ").trim();
      element.replaceWith(h2, block);
    } else {
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/columns.js
  function parse4(element, { document: document2 }) {
    const highlight = element.querySelector(".prodam-image-text-highlight") || element;
    const img = highlight.querySelector(":scope > img, img");
    const overline = highlight.querySelector("h2");
    const title = highlight.querySelector('[class*="--text--title"], h3');
    const description = highlight.querySelector('[class*="--text--description"]');
    const ctaButton = highlight.querySelector('[class*="__bottom"] > a[href]');
    const linkPara = highlight.querySelector('[class*="__bottom--text"]');
    const textCell = [];
    if (overline) textCell.push(overline);
    if (title) textCell.push(title);
    if (description) textCell.push(description);
    if (ctaButton) {
      const a = document2.createElement("a");
      a.setAttribute("href", ctaButton.getAttribute("href"));
      a.textContent = ctaButton.textContent.replace(/\s+/g, " ").trim();
      const p = document2.createElement("p");
      p.append(a);
      textCell.push(p);
    }
    if (linkPara) textCell.push(linkPara);
    const imageCell = [];
    if (img) imageCell.push(img);
    if (textCell.length === 0 && imageCell.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[textCell, imageCell]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/metrics.js
  function parse5(element, { document: document2 }) {
    const stats = Array.from(element.querySelectorAll(".prodam-number-display"));
    const cells = [];
    stats.forEach((stat) => {
      const icon = stat.querySelector('[class*="__svg"] img, img');
      const number = stat.querySelector('[class*="--size-xl"] strong, strong');
      const labelEl = stat.querySelector('[class*="--size-sm"]');
      const numberText = number ? number.textContent.replace(/\s+/g, " ").trim() : "";
      const labelText = labelEl ? labelEl.textContent.replace(/\s+/g, " ").trim() : "";
      if (!numberText && !labelText) return;
      const textCell = [];
      if (numberText) {
        const h3 = document2.createElement("h3");
        const strong = document2.createElement("strong");
        strong.textContent = numberText;
        h3.append(strong);
        textCell.push(h3);
      }
      if (labelText) {
        const p = document2.createElement("p");
        p.textContent = labelText;
        textCell.push(p);
      }
      cells.push([icon || "", textCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "metrics", cells });
    const heading = element.querySelector("h1, h2");
    if (heading) {
      const h2 = document2.createElement("h2");
      h2.textContent = heading.textContent.replace(/\s+/g, " ").trim();
      element.replaceWith(h2, block);
    } else {
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/hero.js
  function parse6(element, { document: document2 }) {
    const img = element.querySelector("img");
    const link = element.querySelector("a[href]");
    if (!img && !link) {
      element.replaceWith(...element.childNodes);
      return;
    }
    let imageContent = img;
    if (link && img) {
      const a = document2.createElement("a");
      a.setAttribute("href", link.getAttribute("href"));
      a.append(img);
      imageContent = a;
    } else if (link && !img) {
      imageContent = link;
    }
    const cells = [[imageContent]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/prodam-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        // Liferay cookie consent banner (cleaned.html:1519 .cookies-banner)
        ".cookies-banner",
        // Hand Talk accessibility widget overlay (cleaned.html:1553 .ht-skip)
        ".ht-skip",
        // Hand Talk plugin fragment inside content (cleaned.html:1371 .lfr-layout-structure-item-hand-talk)
        ".lfr-layout-structure-item-hand-talk",
        ".prodam-handTalk-plugin",
        // Liferay runtime/editor-only chrome (cleaned.html:1547, 1549, 1551)
        ".lfr-spa-loading-bar",
        "#tooltipContainer",
        "#yui3-css-stamp",
        // Editor-only helper alerts, e.g. Menu de Acessibilidade / Scripts (cleaned.html:271, 280, 1374)
        ".page-editor-only"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        // "Pular para o Conteudo principal" skip-link nav (cleaned.html:3 #lihm_quickAccessNav)
        "#lihm_quickAccessNav",
        // Site header incl. top menu, main nav, search (cleaned.html:16 header.prodam-header)
        "header",
        ".lfr-layout-structure-item-cabe-alho",
        // Accessibility tools menu (cleaned.html:227 .prodam-accessibility-menu / :225 wrapper)
        ".prodam-accessibility-menu",
        ".lfr-layout-structure-item-accessibility-menu",
        // Scripts/"conteudo-principal" anchor fragment ONLY (cleaned.html:277 wrapper #a7e98985).
        // NOTE: the bare .lfr-layout-structure-item-basic-component-html class is also used by the
        // authorable news cards (cleaned.html:444/482/520 with UUID 3c4ef7b4), so target the specific
        // Scripts wrapper UUID instead of the shared class to avoid removing card content.
        ".lfr-layout-structure-item-a7e98985-ecf5-e998-243d-e7751c243669",
        // Site footer (cleaned.html:1382 footer.prodam-footer-institutional / :1380 wrapper)
        "footer",
        ".lfr-layout-structure-item-rodape",
        // Hidden helper form (cleaned.html:1511 form#hrefFm)
        "#hrefFm",
        // Non-authorable leftover elements
        "iframe",
        "link",
        "noscript"
      ]);
    }
  }

  // tools/importer/transformers/prodam-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function querySection(root, selectors) {
    for (const sel of selectors) {
      const el = root.querySelector(sel);
      if (el) return el;
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    const sections = payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = querySection(element, section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || querySection(element, section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-home.js
  var parsers = {
    carousel: parse,
    "carousel-logos": parse2,
    cards: parse3,
    columns: parse4,
    metrics: parse5,
    hero: parse6
  };
  var PAGE_TEMPLATE = {
    name: "home",
    description: "Prodam homepage: hero carousel, intro, promo banners, news cards, featured solution, infrastructure metrics, and case/recognition logo carousels.",
    urls: [
      "https://portal.prodam.sp.gov.br/"
    ],
    blocks: [
      {
        name: "carousel",
        section: "hero",
        instances: [
          "#main-content > div.prodam-content-wrapper > div.lfr-layout-structure-item-85d01537-1edb-8f00-8618-0e62d30dff01"
        ]
      },
      {
        name: "hero",
        instances: [
          "div.lfr-layout-structure-item-494206e1-b609-35e6-b79d-5ec15c472fc6",
          "#main-content > div.prodam-content-wrapper > div.lfr-layout-structure-item-3856fe77-db28-d7df-2a15-3f834543be3d"
        ]
      },
      {
        name: "cards",
        section: "news",
        instances: [
          "#main-content > div.prodam-content-wrapper > div.lfr-layout-structure-item-6ea6111e-9778-303a-636b-2ede4697f3df"
        ]
      },
      {
        name: "columns",
        instances: [
          "#main-content > div.prodam-content-wrapper > div.lfr-layout-structure-item-e3778100-38db-c106-1f66-5dae4215d9a5"
        ]
      },
      {
        name: "metrics",
        instances: [
          "#main-content > div.prodam-content-wrapper > div.lfr-layout-structure-item-69e49c8e-35de-d479-5a9e-1d3ccdb870f1"
        ]
      },
      {
        name: "carousel-logos",
        section: "logos",
        instances: [
          "div.lfr-layout-structure-item-b0f2d400-2858-9039-1201-93586ad7c6ce",
          "#main-content > div.prodam-content-wrapper > div.lfr-layout-structure-item-0df630be-f196-1254-9d3c-f57f54f8a8bd"
        ]
      }
    ],
    sections: [
      {
        id: "rc1c2c1",
        name: "Hero image carousel",
        selector: ["#main-content > div.prodam-content-wrapper > div.lfr-layout-structure-item-85d01537-1edb-8f00-8618-0e62d30dff01"],
        style: null
      },
      {
        id: "rc1c2c2",
        name: "Intro - Ola, eu sou a Prodam",
        selector: ["#main-content > div.prodam-content-wrapper > div.lfr-layout-structure-item-4189807c-b023-6b18-772e-5022ba28c498"],
        style: "centered"
      },
      {
        id: "rc1c2c3",
        name: "Prodam Store promo banner",
        selector: ["div.lfr-layout-structure-item-494206e1-b609-35e6-b79d-5ec15c472fc6", "#fmvm"],
        style: null
      },
      {
        id: "rc1c2c5",
        name: "Noticias news cards",
        selector: ["#main-content > div.prodam-content-wrapper > div.lfr-layout-structure-item-6ea6111e-9778-303a-636b-2ede4697f3df"],
        style: null
      },
      {
        id: "rc1c2c7",
        name: "Solucoes Prodam featured solution",
        selector: ["#main-content > div.prodam-content-wrapper > div.lfr-layout-structure-item-e3778100-38db-c106-1f66-5dae4215d9a5"],
        style: "light"
      },
      {
        id: "rc1c2c8",
        name: "Infraestrutura Prodam metrics",
        selector: ["#main-content > div.prodam-content-wrapper > div.lfr-layout-structure-item-69e49c8e-35de-d479-5a9e-1d3ccdb870f1"],
        style: null
      },
      {
        id: "rc1c2c9",
        name: "Smart-city / ISO recognition banner",
        selector: ["#main-content > div.prodam-content-wrapper > div.lfr-layout-structure-item-3856fe77-db28-d7df-2a15-3f834543be3d"],
        style: null
      },
      {
        id: "rc1c2c10",
        name: "Cases logo carousel",
        selector: ["div.lfr-layout-structure-item-b0f2d400-2858-9039-1201-93586ad7c6ce", "#uhht"],
        style: null
      },
      {
        id: "rc1c2c11",
        name: "Reconhecimentos logo carousel",
        selector: ["#main-content > div.prodam-content-wrapper > div.lfr-layout-structure-item-0df630be-f196-1254-9d3c-f57f54f8a8bd"],
        style: "navy"
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    const seen = /* @__PURE__ */ new Set();
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        let elements = [];
        try {
          elements = [...document2.querySelectorAll(selector)];
        } catch (e) {
          console.warn(`Invalid selector for "${blockDef.name}": ${selector}`);
        }
        elements.forEach((element) => {
          if (seen.has(element)) return;
          seen.add(element);
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_home_default = {
    transform: (payload) => {
      const {
        document: document2,
        url,
        html,
        params
      } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_home_exports);
})();
