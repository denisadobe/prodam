/*
 * Universal Editor support (over Document Authoring / da.live).
 * Only loaded on *.ue.da.live hosts. Keeps UE instrumentation (data-aue-*)
 * attached when blocks rewrite their own DOM at decoration time.
 *
 * Piloto: instrumentação do bloco cards (news). Ao ser editado no UE, o
 * cards.js transforma cada <div> de card em <li> e troca a <picture> — este
 * observer move os atributos data-aue-* para os novos nós.
 */
import { moveInstrumentation } from './ue-utils.js';

const setupObservers = () => {
  const mutatingBlocks = document.querySelectorAll('div.cards');
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type !== 'childList' || mutation.target.tagName !== 'DIV') return;

      const type = mutation.target.classList.contains('cards-card-image')
        ? 'cards-image'
        : mutation.target.attributes['data-aue-component']?.value;

      if (type === 'cards') {
        // card <div> rows replaced by a single <ul> of <li> cards
        const added = mutation.addedNodes;
        if (added.length === 1 && added[0].tagName === 'UL') {
          const ul = added[0];
          const removedDivs = [...mutation.removedNodes].filter((n) => n.tagName === 'DIV');
          removedDivs.forEach((div, i) => {
            if (i < ul.children.length) moveInstrumentation(div, ul.children[i]);
          });
        }
      } else if (type === 'cards-image' && mutation.target.classList.contains('cards-card-image')) {
        // optimized <picture> swap inside a card image cell
        const addedPic = [...mutation.addedNodes].filter((n) => n.tagName === 'PICTURE');
        const removedPic = [...mutation.removedNodes].filter((n) => n.tagName === 'PICTURE');
        if (addedPic.length === 1 && removedPic.length === 1) {
          const oldImg = removedPic[0].querySelector('img');
          const newImg = addedPic[0].querySelector('img');
          if (oldImg && newImg) moveInstrumentation(oldImg, newImg);
        }
      }
    });
  });

  mutatingBlocks.forEach((block) => {
    observer.observe(block, { childList: true, subtree: true });
  });
};

const setupUEEventHandlers = () => {
  // When an image field is patched, strip the responsive sources so the UE
  // preview shows the freshly picked image.
  document.body.addEventListener('aue:content-patch', ({ detail: { patch, request } }) => {
    let element = document.querySelector(`[data-aue-resource="${request.target.resource}"]`);
    if (element && element.getAttribute('data-aue-prop') !== patch.name) {
      element = element.querySelector(`[data-aue-prop='${patch.name}']`);
    }
    if (element?.getAttribute('data-aue-type') !== 'media') return;

    const picture = element.tagName === 'IMG' ? element.closest('picture') : element;
    picture?.querySelectorAll('source').forEach((source) => source.remove());
    picture?.querySelector('img')?.removeAttribute('srcset');
  });
};

export default () => {
  setupObservers();
  setupUEEventHandlers();
};
