/**
 * VideoHub Pro — API 客户端
 * 统一管理所有后端接口调用和 JWT Token
 */

const API_BASE = 'http://localhost:8000';
const TOKEN_KEY = 'vh_token';

// ── Token 管理 ────────────────────────────────────────────────────────────
export function getToken()        { return localStorage.getItem(TOKEN_KEY); }
export function saveToken(t)      { localStorage.setItem(TOKEN_KEY, t); }
export function clearToken()      { localStorage.removeItem(TOKEN_KEY); }
export function isLoggedIn()      { return !!getToken(); }

// ── 核心请求函数 ──────────────────────────────────────────────────────────
async function req(path, opts = {}) {
  const token = getToken();
  const headers = { ...(opts.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  // 非 FormData 时自动加 Content-Type: application/json
  if (opts.body && !(opts.body instanceof FormData) && typeof opts.body === 'object') {
    headers['Content-Type'] = 'application/json';
    opts = { ...opts, body: JSON.stringify(opts.body) };
  }

  const res = await fetch(API_BASE + path, { ...opts, headers });

  if (res.status === 401) { clearToken(); window.location.href = 'admin.html'; return; }

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { const j = await res.json(); msg = j.detail || JSON.stringify(j); } catch { }
    throw new Error(msg);
  }

  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : res.text();
}

// ── 公开接口 ──────────────────────────────────────────────────────────────
export const api = {
  /** 分页获取视频列表 */
  videos(params = {}) {
    return req('/api/videos?' + new URLSearchParams(params));
  },
  /** 搜索视频 */
  search(params = {}) {
    return req('/api/videos/search?' + new URLSearchParams(params));
  },
  /** 获取单个视频 */
  video(id) {
    return req(`/api/videos/${id}`);
  },
  /** 记录播放量 */
  recordView(id) {
    return req(`/api/videos/${id}/view`, { method: 'POST' });
  },
  /** 获取所有分类 */
  categories() {
    return req('/api/categories');
  },
  /** 获取各位置 Banner */
  banners() {
    return req('/api/public/banners');
  },
  /** 获取网站设置 */
  settings() {
    return req('/api/public/settings');
  },

  // ── 认证 ────────────────────────────────────────────────────────────────
  auth: {
    /** 登录，成功后自动保存 Token */
    async login(username, password) {
      const res = await req('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ username, password, grant_type: 'password' }),
      });
      if (res?.access_token) saveToken(res.access_token);
      return res;
    },
    /** 获取当前登录用户信息 */
    me() { return req('/api/auth/me'); },
    /** 退出登录 */
    logout() { clearToken(); },
  },

  // ── 管理接口（需要 JWT） ─────────────────────────────────────────────────
  admin: {
    /** 仪表盘统计 */
    stats() { return req('/api/admin/stats'); },

    // -- 视频 --
    /** 分页获取视频列表（管理端，含分类信息） */
    videos(params = {}) {
      return req('/api/admin/videos?' + new URLSearchParams(params));
    },
    /** 添加视频（multipart/form-data） */
    addVideo(formData) {
      return req('/api/admin/videos/add', { method: 'POST', body: formData });
    },
    /** 批量上传视频 */
    batchUpload(formData) {
      return req('/api/admin/videos/batch', { method: 'POST', body: formData });
    },
    /** 编辑视频 */
    editVideo(id, formData) {
      return req(`/api/admin/videos/${id}/edit`, { method: 'POST', body: formData });
    },
    /** 删除视频 */
    deleteVideo(id) {
      return req(`/api/admin/videos/${id}`, { method: 'DELETE' });
    },

    // -- 分类 --
    /** 新增分类 */
    addCategory(name) {
      return req('/api/admin/categories', { method: 'POST', body: { name } });
    },
    /** 删除分类 */
    deleteCategory(id) {
      return req(`/api/admin/categories/${id}`, { method: 'DELETE' });
    },

    // -- Banner --
    /** 获取 Banner 列表 */
    banners(pos = '') {
      return req('/api/admin/banners' + (pos ? `?pos=${pos}` : ''));
    },
    /** 新增 Banner */
    addBanner(data) {
      return req('/api/admin/banners', { method: 'POST', body: data });
    },
    /** 编辑 Banner */
    editBanner(id, data) {
      return req(`/api/admin/banners/${id}`, { method: 'PUT', body: data });
    },
    /** 切换 Banner 启用状态 */
    toggleBanner(id) {
      return req(`/api/admin/banners/${id}/toggle`, { method: 'POST' });
    },
    /** 删除 Banner */
    deleteBanner(id) {
      return req(`/api/admin/banners/${id}`, { method: 'DELETE' });
    },

    // -- 设置 --
    /** 获取系统设置 */
    getSettings() { return req('/api/admin/settings'); },
    /** 保存系统设置 */
    saveSettings(data) {
      return req('/api/admin/settings', { method: 'POST', body: data });
    },
  },
};
