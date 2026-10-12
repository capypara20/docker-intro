/* ===== story.js : スクロールで1枚の図が組み上がる解説 =====
 *
 * 1枚の図（[data-story-master]）に、章（.chapter）の数だけ「詳しさの段階（レベル）」がある。
 * 読んでいる章に合わせて、図のレベルが上がり、部品が増える。ボタンを押す必要はない。
 *
 * 図の部品に書く属性（レベルは 1 始まり。stepper.js と同じ書き方）
 *   data-show="4"        レベル4以上で表示
 *   data-hl="4"          レベル4のときだけ強調
 *   data-state="1:ghost;4:on"   レベルごとに状態を切り替える（ghost ＝ 輪郭だけ）
 *   data-variant="win"   Windows / Linux の切り替えで、片方だけ表示
 *
 * URLの末尾に付けられるもの
 *   ?level=5        そのレベルから始める
 *   ?variant=lin    Linux コンテナ側の図にする
 *   ?fixed=1        スクロールでレベルが変わらないようにする（確認用）
 */
(() => {
  'use strict';

  const root = document.querySelector('[data-story]');
  if (!root || !window.VizAttrs) return;

  const { parseList, parseTimeline, pick } = window.VizAttrs;
  const master = root.querySelector('[data-story-master]');
  const chapters = [...root.querySelectorAll('.chapter')];
  const bar = root.querySelector('.levelbar');
  const titleEl = root.querySelector('.level-title');
  const total = chapters.length;
  const params = new URLSearchParams(window.location.search);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const nodes = [...master.querySelectorAll('[data-show],[data-hide],[data-hl],[data-state]')]
    .map((el) => ({
      el,
      show: el.hasAttribute('data-show') ? Number(el.dataset.show) : null,
      hide: el.hasAttribute('data-hide') ? Number(el.dataset.hide) : null,
      hl: el.hasAttribute('data-hl') ? parseList(el.dataset.hl) : null,
      state: el.hasAttribute('data-state') ? parseTimeline(el.dataset.state) : null,
    }));

  let level = 0;
  let locked = false;
  let lockTimer = null;

  /* 段階バー（Lv1 … Lv9）。スクロールが苦手なときのための近道 */
  const dots = chapters.map((chapter, i) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn lv';
    btn.textContent = `Lv${i + 1}`;
    btn.title = chapter.dataset.title || '';
    btn.addEventListener('click', () => jump(i + 1));
    li.append(btn);
    bar.append(li);
    return btn;
  });

  function setLevel(n) {
    const next = Math.min(Math.max(1, n), total);
    if (next === level) return;
    level = next;

    for (const node of nodes) {
      if (node.show !== null || node.hide !== null) {
        const on = (node.show === null || level >= node.show) && (node.hide === null || level < node.hide);
        node.el.classList.toggle('on', on);
        node.el.setAttribute('aria-hidden', on ? 'false' : 'true');
        node.el.inert = !on;           // まだ現れていない部品は、操作もできないようにする
      }
      if (node.hl) node.el.classList.toggle('hl', node.hl.includes(level));
      if (node.state) node.el.dataset.st = pick(node.state, level).vals[0];
    }

    dots.forEach((btn, i) => {
      btn.setAttribute('aria-current', i + 1 === level ? 'step' : 'false');
      btn.classList.toggle('done', i + 1 < level);
    });
    chapters.forEach((c, i) => c.classList.toggle('current', i + 1 === level));
    titleEl.textContent = `Lv.${level} / ${total}　${chapters[level - 1].dataset.title || ''}`;

    master.dispatchEvent(new CustomEvent('stepchange', { bubbles: true, detail: { step: level } }));
  }

  function jump(n) {
    locked = true;                       // スクロール中に途中の章でレベルが揺れないようにする
    window.clearTimeout(lockTimer);
    lockTimer = window.setTimeout(() => { locked = false; }, 900);
    setLevel(n);
    chapters[n - 1].scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
  }

  /* Windows / Linux の切り替え（図と、右の章の文章の両方に効かせる） */
  function setVariant(value) {
    master.dataset.variant = value;
    root.dataset.variant = value;
    master.dispatchEvent(new CustomEvent('stepchange', { bubbles: true, detail: { step: level } }));
  }

  master.querySelectorAll('input[name="variant"]').forEach((input) => {
    input.addEventListener('change', () => { if (input.checked) setVariant(input.value); });
  });

  const wanted = params.get('variant');
  const initialVariant = (wanted === 'win' || wanted === 'lin') ? wanted : (master.dataset.variant || 'win');
  root.dataset.variant = initialVariant;
  master.dataset.variant = initialVariant;
  const checked = master.querySelector(`input[name="variant"][value="${initialVariant}"]`);
  if (checked) checked.checked = true;

  /* 読んでいる章（画面の真ん中あたりにある章）に、図のレベルを合わせる */
  if (!params.has('fixed') && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      if (locked) return;
      for (const entry of entries) {
        if (entry.isIntersecting) setLevel(chapters.indexOf(entry.target) + 1);
      }
    }, { rootMargin: '-42% 0px -50% 0px', threshold: 0 });
    chapters.forEach((c) => io.observe(c));
  }

  const start = Number(params.get('level')) || 1;
  setLevel(start);
  if (start > 1 && !params.has('fixed')) {
    chapters[Math.min(start, total) - 1].scrollIntoView({ block: 'center' });
  }
})();
