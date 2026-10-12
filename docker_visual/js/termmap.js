/* ===== termmap.js : 用語マップ（箱をクリックすると、意味と関係を表示） =====
 *
 * HTML側の約束
 *   <div class="tm" data-term="キー">          … 箱。キーは terms.js の辞書のキー
 *     <button class="tm-label"><span class="tm-name">表示名</span></button>
 *     <div class="tm-body"> …子の箱… </div>   … 入れ子（＝「〜の中にある」関係）
 *   </div>
 *
 * 「どこにある」「中にあるもの」は、HTMLの入れ子から自動で作る。
 * いま見えている（アニメーションで現れた）箱だけを数える。
 */
(() => {
  'use strict';

  const TERMS = window.TERMS || {};
  const HINT = '図の中の箱をクリックすると、意味と「何の中にあるか・何が入っているか」がここに出ます。';

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* アニメーションでまだ現れていない箱（または、その中身）か。
     Windows / Linux の切り替えで、いま使われていない側の箱も「見えない」扱いにする */
  const isHidden = (el) => {
    if (el.closest('[data-show]:not(.on), [data-hide]:not(.on)') !== null) return true;
    const v = el.closest('[data-variant]');
    return v !== null && v.offsetParent === null;
  };

  const nameOf = (box) => {
    const el = box.querySelector(':scope > .tm-label .tm-name');
    return el ? el.textContent.trim() : '';
  };

  const parentTerm = (el) => (el.parentElement ? el.parentElement.closest('[data-term]') : null);

  function initMap(map) {
    const panel = map.querySelector('.tm-panel');
    const boxes = [...map.querySelectorAll('[data-term]')];

    /* スクロール型のページでは、説明を右の列の上に出す（図を隠さないため） */
    const slot = map.closest('[data-story]') && map.closest('[data-story]').querySelector('.panel-slot');
    if (slot) slot.append(panel);
    let current = null;

    function reset() {
      boxes.forEach((b) => b.classList.remove('sel', 'anc', 'desc'));
      current = null;
      panel.classList.add('empty');
      panel.innerHTML = `<p class="tm-hint">${HINT}</p>`;
    }

    function select(box) {
      current = box;
      panel.classList.remove('empty');
      const term = TERMS[box.dataset.term] || {};
      const myName = nameOf(box);

      /* 入れ子から関係を読み取る */
      const ancestors = [];
      for (let p = parentTerm(box); p && map.contains(p); p = parentTerm(p)) ancestors.unshift(p);
      const children = boxes.filter((b) => parentTerm(b) === box && !isHidden(b));

      boxes.forEach((b) => b.classList.remove('sel', 'anc', 'desc'));
      box.classList.add('sel');
      ancestors.forEach((b) => b.classList.add('anc'));
      children.forEach((b) => b.classList.add('desc'));

      const rows = [];
      if (ancestors.length) {
        const chain = ancestors.map((b) => esc(nameOf(b))).concat(`<strong>${esc(myName)}</strong>`);
        rows.push(['何の中にある？', chain.join(' ＞ ')]);
      }
      if (children.length) {
        rows.push(['中に入っているもの', children.map((b) => esc(nameOf(b))).join('、')]);
      }
      if (term.rel && term.rel.length) {
        rows.push(['ほかの関係', `<ul>${term.rel.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>`]);
      }

      const src = term.src && term.src.length
        ? '出典：' + term.src.map(([label, url]) =>
          `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(label)}</a>`).join(' ／ ')
        : '出典：一般的な用語の説明（公式ページの引用ではありません）';

      panel.innerHTML =
        `<div class="tm-title">${esc(term.name || myName)}</div>` +
        `<p class="tm-def">${esc(term.def || '（この用語の説明はまだありません）')}</p>` +
        (rows.length
          ? `<dl class="tm-rel">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>`
          : '') +
        `<p class="tm-src">${src}</p>`;
    }

    map.addEventListener('click', (e) => {
      const box = e.target.closest('[data-term]');
      if (!box || !map.contains(box) || isHidden(box)) return;
      select(box);
    });

    /* ステップが進んだら、いま見えている範囲で説明を更新（消えた箱なら選択を解除） */
    const scene = map.closest('.scene, [data-story]');
    if (scene) {
      scene.addEventListener('stepchange', () => {
        if (!current) return;
        if (isHidden(current)) reset(); else select(current);
      });
    }

    reset();

    /* ?term=container のように指定すると、その用語を最初から選んだ状態にする（確認・共有用） */
    const want = new URLSearchParams(window.location.search).get('term');
    if (want) {
      const hit = boxes.find((b) => b.dataset.term === want && !isHidden(b));
      if (hit) select(hit);
    }
  }

  document.querySelectorAll('.termmap').forEach(initMap);
})();
