/* ===== tabs.js : タブ切り替え（#image のようなURLの末尾でも開ける） ===== */
(() => {
  'use strict';

  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const panels = tabs.map((t) => document.getElementById(t.getAttribute('aria-controls')));

  function select(index, { focus = false } = {}) {
    if (typeof window.pauseAllScenes === 'function') window.pauseAllScenes();
    tabs.forEach((tab, i) => {
      const on = i === index;
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
      panels[i].hidden = !on;
    });
    if (focus) tabs[index].focus();
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      select(i);
      history.replaceState(null, '', `#${panels[i].id}`);
    });
    tab.addEventListener('keydown', (e) => {
      const last = tabs.length - 1;
      let next = null;
      if (e.key === 'ArrowRight') next = i === last ? 0 : i + 1;
      if (e.key === 'ArrowLeft') next = i === 0 ? last : i - 1;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = last;
      if (next !== null) { e.preventDefault(); select(next, { focus: true }); }
    });
  });

  /* #image のようなタブ名だけでなく、#t-stack のような「図の見出し」も指定できる */
  const target = window.location.hash ? document.getElementById(window.location.hash.slice(1)) : null;
  const owner = target ? target.closest('.panel') : null;
  const fromHash = owner ? panels.indexOf(owner) : -1;
  select(fromHash >= 0 ? fromHash : 0);
  if (fromHash >= 0 && target !== owner) target.scrollIntoView();
})();
