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
//
// opts.auth === true 表示这是「需要登录」的后台接口：
//   - 自动附带 Authorization: Bearer <token>
//   - 收到 401 时清除 token 并跳转到 admin.html（重新登录）
// 公开接口（首页 / 视频详情 / 分类 / Banner / 设置）不传 auth：
//   - 完全不携带 token
//   - 即使返回 401 也只抛错，绝不跳转登录页
async function req(path, opts = {}) {
  const needAuth = opts.auth === true;
  const token = getToken();
  const headers = { ...(opts.headers || {}) };

  // 仅后台接口附带 token；公开页面请求不带，保证完全匿名访问
  if (needAuth && token) headers['Authorization'] = `Bearer ${token}`;

  // 纯 JSON 对象才转成 JSON 字符串。
  // FormData（文件上传）和 URLSearchParams（登录表单）必须原样传给 fetch，
  // 由浏览器/调用方自行设置正确的 Content-Type，不可被覆盖成 application/json。
  const body = opts.body;
  const isRaw = body instanceof FormData || body instanceof URLSearchParams;
  if (body && !isRaw && typeof body === 'object') {
    headers['Content-Type'] = 'application/json';
    opts = { ...opts, body: JSON.stringify(body) };
  }

  const res = await fetch(API_BASE + path, { ...opts, headers });

  if (res.status === 401) {
    clearToken();
    // 只有后台接口在 session 失效时才跳转登录页；公开页面与登录请求只抛错
    if (needAuth && token) { window.location.href = 'admin.html'; return; }
    throw new Error(await parseError(res, '用户名或密码错误'));
  }

  if (!res.ok) {
    throw new Error(await parseError(res, `HTTP ${res.status}`));
  }

  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : res.text();
}

/** 后台接口请求：自动带 token、401 时跳转登录 */
function authReq(path, opts = {}) {
  return req(path, { ...opts, auth: true });
}

/** 把后端错误响应解析成可读字符串，兼容 FastAPI 的 detail 字符串 / 422 detail 数组 */
async function parseError(res, fallback) {
  try {
    const j = await res.json();
    const d = j.detail;
    if (typeof d === 'string') return d;
    if (Array.isArray(d)) {
      return d.map(e => e.msg || JSON.stringify(e)).join('; ');
    }
    if (d) return JSON.stringify(d);
    return JSON.stringify(j);
  } catch {
    return fallback;
  }
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
    /** 获取当前登录用户信息（需要 token） */
    me() { return authReq('/api/auth/me'); },
    /** 退出登录 */
    logout() { clearToken(); },
  },

  // ── 管理接口（需要 JWT，全部走 authReq） ──────────────────────────────────
  admin: {
    /** 仪表盘统计 */
    stats() { return authReq('/api/admin/stats'); },

    // -- 视频 --
    /** 分页获取视频列表（管理端，含分类信息） */
    videos(params = {}) {
      return authReq('/api/admin/videos?' + new URLSearchParams(params));
    },
    /** 添加视频（multipart/form-data） */
    addVideo(formData) {
      return authReq('/api/admin/videos/add', { method: 'POST', body: formData });
    },
    /** 批量上传视频 */
    batchUpload(formData) {
      return authReq('/api/admin/videos/batch', { method: 'POST', body: formData });
    },
    /** 编辑视频 */
    editVideo(id, formData) {
      return authReq(`/api/admin/videos/${id}/edit`, { method: 'POST', body: formData });
    },
    /** 删除视频 */
    deleteVideo(id) {
      return authReq(`/api/admin/videos/${id}`, { method: 'DELETE' });
    },

    // -- 分类 --
    /** 新增分类 */
    addCategory(name) {
      return authReq('/api/admin/categories', { method: 'POST', body: { name } });
    },
    /** 删除分类 */
    deleteCategory(id) {
      return authReq(`/api/admin/categories/${id}`, { method: 'DELETE' });
    },

    // -- Banner --
    /** 获取 Banner 列表 */
    banners(pos = '') {
      return authReq('/api/admin/banners' + (pos ? `?pos=${pos}` : ''));
    },
    /** 新增 Banner */
    addBanner(data) {
      return authReq('/api/admin/banners', { method: 'POST', body: data });
    },
    /** 编辑 Banner */
    editBanner(id, data) {
      return authReq(`/api/admin/banners/${id}`, { method: 'PUT', body: data });
    },
    /** 切换 Banner 启用状态 */
    toggleBanner(id) {
      return authReq(`/api/admin/banners/${id}/toggle`, { method: 'POST' });
    },
    /** 删除 Banner */
    deleteBanner(id) {
      return authReq(`/api/admin/banners/${id}`, { method: 'DELETE' });
    },

    // -- 设置 --
    /** 获取系统设置 */
    getSettings() { return authReq('/api/admin/settings'); },
    /** 保存系统设置 */
    saveSettings(data) {
      return authReq('/api/admin/settings', { method: 'POST', body: data });
    },
  },
};
