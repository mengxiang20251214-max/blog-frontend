/**
 * 侧滑抽屉菜单（移动端汉堡菜单）。
 * 纯新增模块：操作页面里已有的抽屉 DOM（#hamburger / #drawer / #drawerBackdrop /
 * #drawerClose / #drawerCats），不依赖任何后端改动。
 *
 * 用法：
 *   import { setupDrawer } from './js/menu.js';
 *   const drawer = setupDrawer({ onCategory: (id) => {...} });
 *   drawer.renderCategories(cats, activeId);  // 分类加载完后填充
 */
import { t, esc } from './main.js';

export function setupDrawer({ onCategory } = {}) {
  const ham      = document.getElementById('hamburger');
  const drawer   = document.getElementById('drawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const closeBtn = document.getElementById('drawerClose');
  const catsBox  = document.getElementById('drawerCats');

  function open() {
    drawer && drawer.classList.add('open');
    backdrop && backdrop.classList.add('open');
    drawer && drawer.setAttribute('aria-hidden', 'false');
    ham && ham.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';   // 抽屉打开时锁定背景滚动
  }
  function close() {
    drawer && drawer.classList.remove('open');
    backdrop && backdrop.classList.remove('open');
    drawer && drawer.setAttribute('aria-hidden', 'true');
    ham && ham.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  ham && ham.addEventListener('click', open);
  closeBtn && closeBtn.addEventListener('click', close);
  backdrop && backdrop.addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  // 抽屉内分类点击 → 回调 + 关闭
  catsBox && catsBox.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-cat]');
    if (!btn) return;
    onCategory && onCategory(btn.dataset.cat);
    close();
  });

  function renderCategories(cats = [], activeId = '') {
    if (!catsBox) return;
    const item = (id, label, active) =>
      `<button class="drawer-cat${active ? ' active' : ''}" data-cat="${id}">${esc(label)}</button>`;
    catsBox.innerHTML =
      item('', t('all'), !activeId) +
      cats.map(c => item(c.id, c.name, String(activeId) === String(c.id))).join('');
  }
  function setActive(id) {
    catsBox && catsBox.querySelectorAll('.drawer-cat').forEach(b =>
      b.classList.toggle('active', b.dataset.cat === String(id)));
  }

  return { open, close, renderCategories, setActive };
}
