/**
 * VideoHub Pro — 共享工具函数
 * 由 index.html / video.html / admin.html 按需引入
 */

/** 格式化文件大小 */
export function fmtBytes(n) {
  if (!n) return '';
  if (n < 1024) return `${n} B`;
  if (n < 1048576) return `${(n/1024).toFixed(1)} KB`;
  if (n < 1073741824) return `${(n/1048576).toFixed(1)} MB`;
  return `${(n/1073741824).toFixed(2)} GB`;
}

/** 防抖 */
export function debounce(fn, ms = 300) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

/** 简单 Toast（可在非 module 脚本中用 window.toast） */
export function showToast(msg, type = 'info', stackId = 'toastStack') {
  const stack = document.getElementById(stackId);
  if (!stack) return;
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.textContent = msg;
  stack.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 300); }, 3000);
}

/** URL 查询参数解析 */
export function qs(key) {
  return new URLSearchParams(location.search).get(key);
}

/** 给所有 target="_blank" 补 rel="noopener" */
export function fixExternalLinks() {
  document.querySelectorAll('a[target="_blank"]').forEach(a => {
    if (!a.rel.includes('noopener')) a.rel += ' noopener noreferrer';
  });
}

/** 图片加载失败处理（通用占位图） */
export function fixBrokenImages(fallbackSeed = '') {
  document.querySelectorAll('img[data-id]').forEach(img => {
    img.addEventListener('error', function() {
      this.src = `https://picsum.photos/seed/${this.dataset.id || fallbackSeed}/640/360`;
    });
  });
}

document.addEventListener('DOMContentLoaded', fixExternalLinks);
