/* ===== stepper.js : アニメーションの「ステップ送り」エンジン =====
 *
 * HTML側に書く属性（ステップ番号は画面表示と同じ 1 始まり）
 *   data-show="3"          3 以上で表示（フェードイン）
 *   data-hide="5"          5 以上で非表示
 *   data-hl="2,3"          2 と 3 のときだけ強調（枠がぴかぴか）
 *   data-state="1:new;3:redo"   ステップごとに data-st の値を切り替える（色・ラベルはCSS側）
 *   data-move="1:10;3:70,40"    ステップごとに位置(%)を切り替える（left[,top]）
 *
 * キャプション（説明文）は <ol class="caption-list"><li>…</li></ol> に書く。
 * <li> の数が、そのシーンのステップ数になる。
 */
(() => {
  'use strict';

  const AUTOPLAY_MS = 2800;
  const steppers = [];

  const parseList = (value) =>
    String(value).split(',').map((s) => Number(s.trim())).filter((n) => !Number.isNaN(n));

  /* "1:10;3:70,40" -> [{step:1, vals:['10']}, {step:3, vals:['70','40']}]  (step 昇順) */
  const parseTimeline = (value) =>
    String(value).split(';').map((chunk) => {
      const [step, rest = ''] = chunk.split(':');
      return { step: Number(step), vals: rest.split(',').map((s) => s.trim()) };
    }).filter((e) => !Number.isNaN(e.step)).sort((a, b) => a.step - b.step);

  /* step 以下で最後のエントリを返す（無ければ最初のエントリ） */
  const pick = (timeline, step) => {
    let hit = timeline[0];
    for (const e of timeline) if (e.step <= step) hit = e;
    return hit;
  };

  class Stepper {
    constructor(scene) {
      this.scene = scene;
      this.stage = scene.querySelector('.stage');
      this.captions = [...scene.querySelectorAll('.caption-list > li')];
      this.total = this.captions.length;
      this.step = 1;
      this.timer = null;

      this.buildControls();

      this.nodes = [...this.stage.querySelectorAll('[data-show],[data-hide],[data-hl],[data-state],[data-move]')]
        .map((el) => ({
          el,
          show: el.hasAttribute('data-show') ? Number(el.dataset.show) : null,
          hide: el.hasAttribute('data-hide') ? Number(el.dataset.hide) : null,
          hl: el.hasAttribute('data-hl') ? parseList(el.dataset.hl) : null,
          state: el.hasAttribute('data-state') ? parseTimeline(el.dataset.state) : null,
          move: el.hasAttribute('data-move') ? parseTimeline(el.dataset.move) : null,
        }));

      this.prevBtn.addEventListener('click', () => { this.pause(); this.go(this.step - 1); });
      this.nextBtn.addEventListener('click', () => { this.pause(); this.go(this.step + 1); });
      this.resetBtn.addEventListener('click', () => { this.pause(); this.go(1); });
      this.playBtn.addEventListener('click', () => (this.timer ? this.pause() : this.play()));

      this.go(1);
    }

    /* 進捗バー・説明文・ボタンは、HTMLに書かずここで作る（HTMLを短く保つため） */
    buildControls() {
      const ui = document.createElement('div');
      ui.className = 'scene-ui';
      ui.innerHTML = `
        <div class="progress"><span></span></div>
        <div class="caption" aria-live="polite"><div class="caption-body"></div></div>
        <div class="controls">
          <button type="button" class="btn" data-act="prev">◀ 戻る</button>
          <button type="button" class="btn primary" data-act="play" aria-pressed="false">▶ 再生</button>
          <button type="button" class="btn" data-act="next">次へ ▶</button>
          <button type="button" class="btn" data-act="reset">↻ 最初から</button>
          <span class="step-count"></span>
        </div>`;
      /* 図と説明・操作を、ひとまとまり（scene-main）にする。広い画面では横に並ぶ */
      const main = document.createElement('div');
      main.className = 'scene-main';
      this.stage.before(main);
      main.append(this.stage, ui);

      this.captionEl = ui.querySelector('.caption-body');
      this.countEl = ui.querySelector('.step-count');
      this.barEl = ui.querySelector('.progress > span');
      this.prevBtn = ui.querySelector('[data-act="prev"]');
      this.nextBtn = ui.querySelector('[data-act="next"]');
      this.playBtn = ui.querySelector('[data-act="play"]');
      this.resetBtn = ui.querySelector('[data-act="reset"]');
    }

    go(n) {
      this.step = Math.min(Math.max(1, n), this.total);
      this.render();
    }

    render() {
      const s = this.step;
      this.stage.dataset.step = String(s);

      for (const n of this.nodes) {
        if (n.show !== null || n.hide !== null) {
          const on = (n.show === null || s >= n.show) && (n.hide === null || s < n.hide);
          n.el.classList.toggle('on', on);
          n.el.setAttribute('aria-hidden', on ? 'false' : 'true');
        }
        if (n.hl) n.el.classList.toggle('hl', n.hl.includes(s));
        if (n.state) n.el.dataset.st = pick(n.state, s).vals[0];
        if (n.move) {
          const [left, top] = pick(n.move, s).vals;
          if (left !== undefined && left !== '') n.el.style.left = `${left}%`;
          if (top !== undefined && top !== '') n.el.style.top = `${top}%`;
        }
      }

      this.captionEl.innerHTML =
        `<span class="step-no">STEP ${s}</span>${this.captions[s - 1].innerHTML}`;
      this.countEl.textContent = `${s} / ${this.total}`;
      this.barEl.style.width = `${(s / this.total) * 100}%`;
      this.prevBtn.disabled = s <= 1;
      this.nextBtn.disabled = s >= this.total;

      /* 用語マップなどが、表示の変化に合わせて内容を更新できるように知らせる */
      this.scene.dispatchEvent(new CustomEvent('stepchange', { detail: { step: s } }));
    }

    play() {
      if (this.step >= this.total) this.go(1);
      this.playBtn.textContent = '⏸ 一時停止';
      this.playBtn.setAttribute('aria-pressed', 'true');
      this.timer = window.setInterval(() => {
        if (this.step >= this.total) { this.pause(); return; }
        this.go(this.step + 1);
      }, AUTOPLAY_MS);
    }

    pause() {
      if (this.timer) { window.clearInterval(this.timer); this.timer = null; }
      this.playBtn.textContent = '▶ 再生';
      this.playBtn.setAttribute('aria-pressed', 'false');
    }
  }

  /* story.js（スクロール型の解説）が、同じ書き方の属性を読めるように公開する */
  window.VizAttrs = { parseList, parseTimeline, pick };

  /* 他のタブへ切り替えたときに、動いているアニメーションを止める */
  window.pauseAllScenes = () => steppers.forEach((s) => s.pause());

  document.querySelectorAll('.scene[data-scene]').forEach((scene) => {
    steppers.push(new Stepper(scene));
  });

  /* ?step=3 を付けると、全シーンをそのステップから表示（動作確認・共有用） */
  const q = new URLSearchParams(window.location.search).get('step');
  if (q !== null && /^\d+$/.test(q)) steppers.forEach((s) => s.go(Number(q)));
})();
