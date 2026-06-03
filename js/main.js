/**
 * VideoHub Pro — 共享模块
 *  • i18n：浏览器语言检测 + 中/英/泰三语字典 + applyI18n
 *  • 二级菜单渲染（国家 → 类型）
 *  • 通用工具：fmtBytes / debounce / showToast / qs
 *
 * 翻译范围：导航、按钮、提示文字（界面文案）
 * 不翻译：视频标题、描述、分类/国家/类型名称（数据内容）
 */

// ── i18n 字典 ──────────────────────────────────────────────────────────────
// 后台语言切换器支持：中 / 英 / 泰
export const SUPPORTED_LANGS = ['zh', 'en', 'th'];
export const LANG_LABELS = { zh: '中文', en: 'English', th: 'ไทย' };
const LANG_KEY = 'vh_lang';
const DEFAULT_LANG = 'en';        // 后台默认英语（前台首页用 setRuntimeLang('id') 强制印尼语）

// 运行时语言覆盖（不写 localStorage）：供首页强制印尼语，避免污染后台语言偏好
let _runtimeLang = null;
export function setRuntimeLang(lang) { _runtimeLang = lang; }

const I18N = {
  zh: {
    nav_home: '首页', nav_admin: '管理',
    download_app: '下载 APP', contact_us: '联系客服', promo: '推广',
    cat_title: '分类', hot_tags: '热门标签', about: '关于', menu: '菜单',
    search_ph: '搜索视频...',
    menu_country: '国家', menu_type: '类型', all: '全部',
    latest: '最新视频', unit_videos: '个视频',
    empty: '暂无视频', load_failed: '加载失败',
    prev: '上一页', next: '下一页', search_prefix: '搜索',
    back_home: '← 返回首页', related: '相关推荐',
    views_unit: '次播放', no_source: '暂无播放源', invalid_video: '无效的视频 ID',
    // admin
    admin_title: '管理后台', login_sub: '请登录管理员账号',
    username: '用户名', password: '密码', login_btn: '登录',
    login_ing: '登录中...', login_fail: '登录失败',
    default_account: '默认账号：admin / admin123',
    nav_dashboard: '仪表盘', nav_videos: '视频管理', nav_categories: '分类管理',
    nav_banners: 'Banner', nav_settings: '系统设置',
    nav_preview: '前台预览', nav_logout: '退出',
    btn_add_video: '+ 添加视频', btn_batch: '批量上传',
    btn_add_banner: '+ 新增 Banner', btn_save: '保存', btn_cancel: '取消',
    btn_add: '添加', btn_delete: '删除', btn_edit: '编辑',
    stat_videos: '视频总数', stat_cats: '分类数', stat_banners: 'Banner（启用）',
    recent_uploads: '最近上传', view_all: '查看全部 →',
    th_video: '视频', th_source: '来源', th_category: '分类', th_country: '国家',
    th_type: '类型', th_time: '时间', th_actions: '操作', th_preview: '预览',
    th_title: '标题', th_position: '位置', th_sort: '排序', th_status: '状态',
    th_slug: 'Slug', th_count: '视频数',
    saved: '设置已保存', lang_label: '语言',
    change_pwd: '修改密码', old_pwd: '原密码', new_pwd: '新密码（至少 6 位）',
    confirm_pwd: '确认新密码', pwd_mismatch: '两次输入的新密码不一致',
    pwd_short: '新密码至少 6 位', pwd_changed: '密码修改成功',
    all_categories: '全部分类',
    src_local: '本地', src_url: 'URL',
    st_active: '启用', st_inactive: '停用',
    media_image: '🖼 图片', media_gif: '🎞 GIF', media_video: '🎬 视频',
    uploading: '⏳ 正在上传，大文件需较长时间，请勿关闭…',
    uploading_batch: '⏳ 批量上传中，请耐心等待…',
    confirm_del_video: '确认删除「{x}」？', confirm_del_cat: '删除「{x}」？该分类下的视频将变为无分类。',
    confirm_del_banner: '确认删除该 Banner？',
    session_expired: '会话已过期，请重新登录',
    load_error: '加载失败',
    added: '已添加', updated: '已更新', deleted: '已删除', saving: '保存中…',
    modal_video_add: '添加视频', modal_video_edit: '编辑视频',
    modal_banner_add: '新增 Banner', modal_banner_edit: '编辑 Banner',
    cover_regen: '重提封面', cover_backfill: '补全封面', cover_done: '封面已更新',
    cover_fail: '封面提取失败', cover_scheduled: '已排入封面任务：{x} 个',
    uploading_banner: '⏳ 正在上传媒体，请稍候…', no_pending_cover: '没有需要补封面的视频',
    backup_title: '数据库备份', backup_now: '立即备份', backup_running: '备份中…',
    backup_done: '备份成功', backup_empty: '暂无备份', th_size: '大小', backup_download: '下载',
    backup_hint: '每天 02:00 自动备份到 R2，保留最近 30 天（需在 Railway 设 BACKUP_ENABLED=true）',
  },
  en: {
    nav_home: 'Home', nav_admin: 'Admin',
    download_app: 'Download App', contact_us: 'Contact Us', promo: 'Promo',
    cat_title: 'Categories', hot_tags: 'Hot Tags', about: 'About', menu: 'Menu',
    search_ph: 'Search videos...',
    menu_country: 'Country', menu_type: 'Type', all: 'All',
    latest: 'Latest Videos', unit_videos: 'videos',
    empty: 'No videos', load_failed: 'Load failed',
    prev: 'Prev', next: 'Next', search_prefix: 'Search',
    back_home: '← Back', related: 'Related',
    views_unit: 'views', no_source: 'No source available', invalid_video: 'Invalid video ID',
    admin_title: 'Admin Panel', login_sub: 'Sign in as administrator',
    username: 'Username', password: 'Password', login_btn: 'Sign In',
    login_ing: 'Signing in...', login_fail: 'Login failed',
    default_account: 'Default: admin / admin123',
    nav_dashboard: 'Dashboard', nav_videos: 'Videos', nav_categories: 'Categories',
    nav_banners: 'Banners', nav_settings: 'Settings',
    nav_preview: 'Preview', nav_logout: 'Logout',
    btn_add_video: '+ Add Video', btn_batch: 'Batch Upload',
    btn_add_banner: '+ Add Banner', btn_save: 'Save', btn_cancel: 'Cancel',
    btn_add: 'Add', btn_delete: 'Delete', btn_edit: 'Edit',
    stat_videos: 'Total Videos', stat_cats: 'Categories', stat_banners: 'Banners (active)',
    recent_uploads: 'Recent Uploads', view_all: 'View all →',
    th_video: 'Video', th_source: 'Source', th_category: 'Category', th_country: 'Country',
    th_type: 'Type', th_time: 'Date', th_actions: 'Actions', th_preview: 'Preview',
    th_title: 'Title', th_position: 'Position', th_sort: 'Sort', th_status: 'Status',
    th_slug: 'Slug', th_count: 'Videos',
    saved: 'Settings saved', lang_label: 'Language',
    change_pwd: 'Change Password', old_pwd: 'Current password', new_pwd: 'New password (min 6)',
    confirm_pwd: 'Confirm new password', pwd_mismatch: 'New passwords do not match',
    pwd_short: 'New password must be at least 6 characters', pwd_changed: 'Password changed',
    all_categories: 'All categories',
    src_local: 'Local', src_url: 'URL',
    st_active: 'Active', st_inactive: 'Inactive',
    media_image: '🖼 Image', media_gif: '🎞 GIF', media_video: '🎬 Video',
    uploading: '⏳ Uploading, large files take a while, do not close…',
    uploading_batch: '⏳ Batch uploading, please wait…',
    confirm_del_video: 'Delete "{x}"?', confirm_del_cat: 'Delete "{x}"? Its videos will become uncategorized.',
    confirm_del_banner: 'Delete this banner?',
    session_expired: 'Session expired, please sign in again',
    load_error: 'Load failed',
    added: 'Added', updated: 'Updated', deleted: 'Deleted', saving: 'Saving…',
    modal_video_add: 'Add Video', modal_video_edit: 'Edit Video',
    modal_banner_add: 'Add Banner', modal_banner_edit: 'Edit Banner',
    cover_regen: 'Regen cover', cover_backfill: 'Backfill covers', cover_done: 'Cover updated',
    cover_fail: 'Cover extraction failed', cover_scheduled: 'Queued {x} cover job(s)',
    uploading_banner: '⏳ Uploading media, please wait…', no_pending_cover: 'No videos need a cover',
    backup_title: 'Database Backup', backup_now: 'Backup now', backup_running: 'Backing up…',
    backup_done: 'Backup done', backup_empty: 'No backups yet', th_size: 'Size', backup_download: 'Download',
    backup_hint: 'Auto-backup daily 02:00 to R2, last 30 days kept (set BACKUP_ENABLED=true on Railway)',
  },
  th: {
    nav_home: 'หน้าแรก', nav_admin: 'จัดการ',
    download_app: 'ดาวน์โหลดแอป', contact_us: 'ติดต่อเรา', promo: 'โปรโมชัน',
    cat_title: 'หมวดหมู่', hot_tags: 'แท็กยอดนิยม', about: 'เกี่ยวกับ', menu: 'เมนู',
    search_ph: 'ค้นหาวิดีโอ...',
    menu_country: 'ประเทศ', menu_type: 'ประเภท', all: 'ทั้งหมด',
    latest: 'วิดีโอล่าสุด', unit_videos: 'วิดีโอ',
    empty: 'ไม่มีวิดีโอ', load_failed: 'โหลดล้มเหลว',
    prev: 'ก่อนหน้า', next: 'ถัดไป', search_prefix: 'ค้นหา',
    back_home: '← กลับหน้าแรก', related: 'ที่เกี่ยวข้อง',
    views_unit: 'ครั้ง', no_source: 'ไม่มีแหล่งวิดีโอ', invalid_video: 'รหัสวิดีโอไม่ถูกต้อง',
    admin_title: 'แผงควบคุม', login_sub: 'เข้าสู่ระบบผู้ดูแล',
    username: 'ชื่อผู้ใช้', password: 'รหัสผ่าน', login_btn: 'เข้าสู่ระบบ',
    login_ing: 'กำลังเข้าสู่ระบบ...', login_fail: 'เข้าสู่ระบบล้มเหลว',
    default_account: 'ค่าเริ่มต้น: admin / admin123',
    nav_dashboard: 'แดชบอร์ด', nav_videos: 'วิดีโอ', nav_categories: 'หมวดหมู่',
    nav_banners: 'แบนเนอร์', nav_settings: 'ตั้งค่า',
    nav_preview: 'ดูหน้าเว็บ', nav_logout: 'ออกจากระบบ',
    btn_add_video: '+ เพิ่มวิดีโอ', btn_batch: 'อัปโหลดหลายไฟล์',
    btn_add_banner: '+ เพิ่มแบนเนอร์', btn_save: 'บันทึก', btn_cancel: 'ยกเลิก',
    btn_add: 'เพิ่ม', btn_delete: 'ลบ', btn_edit: 'แก้ไข',
    stat_videos: 'วิดีโอทั้งหมด', stat_cats: 'หมวดหมู่', stat_banners: 'แบนเนอร์ (เปิด)',
    recent_uploads: 'อัปโหลดล่าสุด', view_all: 'ดูทั้งหมด →',
    th_video: 'วิดีโอ', th_source: 'แหล่ง', th_category: 'หมวดหมู่', th_country: 'ประเทศ',
    th_type: 'ประเภท', th_time: 'วันที่', th_actions: 'จัดการ', th_preview: 'ตัวอย่าง',
    th_title: 'ชื่อ', th_position: 'ตำแหน่ง', th_sort: 'ลำดับ', th_status: 'สถานะ',
    th_slug: 'Slug', th_count: 'วิดีโอ',
    saved: 'บันทึกแล้ว', lang_label: 'ภาษา',
    change_pwd: 'เปลี่ยนรหัสผ่าน', old_pwd: 'รหัสผ่านเดิม', new_pwd: 'รหัสผ่านใหม่ (อย่างน้อย 6)',
    confirm_pwd: 'ยืนยันรหัสผ่านใหม่', pwd_mismatch: 'รหัสผ่านใหม่ไม่ตรงกัน',
    pwd_short: 'รหัสผ่านใหม่อย่างน้อย 6 ตัว', pwd_changed: 'เปลี่ยนรหัสผ่านแล้ว',
    all_categories: 'ทุกหมวดหมู่',
    src_local: 'ในเครื่อง', src_url: 'URL',
    st_active: 'เปิด', st_inactive: 'ปิด',
    media_image: '🖼 รูปภาพ', media_gif: '🎞 GIF', media_video: '🎬 วิดีโอ',
    uploading: '⏳ กำลังอัปโหลด ไฟล์ใหญ่ใช้เวลาสักครู่ อย่าปิด…',
    uploading_batch: '⏳ กำลังอัปโหลดหลายไฟล์ โปรดรอ…',
    confirm_del_video: 'ลบ "{x}" หรือไม่?', confirm_del_cat: 'ลบ "{x}"? วิดีโอในหมวดนี้จะไม่มีหมวดหมู่',
    confirm_del_banner: 'ลบแบนเนอร์นี้?',
    session_expired: 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่',
    load_error: 'โหลดล้มเหลว',
    added: 'เพิ่มแล้ว', updated: 'อัปเดตแล้ว', deleted: 'ลบแล้ว', saving: 'กำลังบันทึก…',
    modal_video_add: 'เพิ่มวิดีโอ', modal_video_edit: 'แก้ไขวิดีโอ',
    modal_banner_add: 'เพิ่มแบนเนอร์', modal_banner_edit: 'แก้ไขแบนเนอร์',
    cover_regen: 'สร้างปกใหม่', cover_backfill: 'เติมปก', cover_done: 'อัปเดตปกแล้ว',
    cover_fail: 'สร้างปกล้มเหลว', cover_scheduled: 'เข้าคิวสร้างปก {x} รายการ',
    uploading_banner: '⏳ กำลังอัปโหลดสื่อ โปรดรอ…', no_pending_cover: 'ไม่มีวิดีโอที่ต้องใส่ปก',
    backup_title: 'สำรองฐานข้อมูล', backup_now: 'สำรองทันที', backup_running: 'กำลังสำรอง…',
    backup_done: 'สำรองสำเร็จ', backup_empty: 'ยังไม่มีข้อมูลสำรอง', th_size: 'ขนาด', backup_download: 'ดาวน์โหลด',
    backup_hint: 'สำรองอัตโนมัติทุกวัน 02:00 ไป R2 เก็บ 30 วัน (ตั้ง BACKUP_ENABLED=true บน Railway)',
  },
  id: {
    nav_home: 'Beranda', nav_admin: 'Admin',
    download_app: 'Unduh Aplikasi', contact_us: 'Hubungi Kami', promo: 'Promosi',
    cat_title: 'Kategori', hot_tags: 'Tag Populer', about: 'Tentang', menu: 'Menu',
    search_ph: 'Cari video...',
    menu_country: 'Negara', menu_type: 'Jenis', all: 'Semua',
    latest: 'Video Terbaru', unit_videos: 'video',
    empty: 'Belum ada video', load_failed: 'Gagal memuat',
    prev: 'Sebelumnya', next: 'Berikutnya', search_prefix: 'Cari',
    back_home: '← Kembali', related: 'Terkait',
    views_unit: 'tayangan', no_source: 'Tidak ada sumber video', invalid_video: 'ID video tidak valid',
    admin_title: 'Panel Admin', login_sub: 'Masuk sebagai administrator',
    username: 'Nama pengguna', password: 'Kata sandi', login_btn: 'Masuk',
    login_ing: 'Sedang masuk...', login_fail: 'Gagal masuk',
    default_account: 'Default: admin / admin123',
    nav_dashboard: 'Dasbor', nav_videos: 'Video', nav_categories: 'Kategori',
    nav_banners: 'Banner', nav_settings: 'Pengaturan',
    nav_preview: 'Pratinjau', nav_logout: 'Keluar',
    btn_add_video: '+ Tambah Video', btn_batch: 'Unggah Massal',
    btn_add_banner: '+ Tambah Banner', btn_save: 'Simpan', btn_cancel: 'Batal',
    btn_add: 'Tambah', btn_delete: 'Hapus', btn_edit: 'Ubah',
    stat_videos: 'Total Video', stat_cats: 'Kategori', stat_banners: 'Banner (aktif)',
    recent_uploads: 'Unggahan Terbaru', view_all: 'Lihat semua →',
    th_video: 'Video', th_source: 'Sumber', th_category: 'Kategori', th_country: 'Negara',
    th_type: 'Jenis', th_time: 'Tanggal', th_actions: 'Aksi', th_preview: 'Pratinjau',
    th_title: 'Judul', th_position: 'Posisi', th_sort: 'Urutan', th_status: 'Status',
    th_slug: 'Slug', th_count: 'Video',
    saved: 'Pengaturan disimpan', lang_label: 'Bahasa',
    change_pwd: 'Ubah Kata Sandi', old_pwd: 'Kata sandi lama', new_pwd: 'Kata sandi baru (min 6)',
    confirm_pwd: 'Konfirmasi kata sandi baru', pwd_mismatch: 'Kata sandi baru tidak cocok',
    pwd_short: 'Kata sandi baru minimal 6 karakter', pwd_changed: 'Kata sandi diubah',
    all_categories: 'Semua kategori',
    src_local: 'Lokal', src_url: 'URL',
    st_active: 'Aktif', st_inactive: 'Nonaktif',
    media_image: '🖼 Gambar', media_gif: '🎞 GIF', media_video: '🎬 Video',
    uploading: '⏳ Mengunggah, file besar butuh waktu, jangan tutup…',
    uploading_batch: '⏳ Mengunggah massal, harap tunggu…',
    confirm_del_video: 'Hapus "{x}"?', confirm_del_cat: 'Hapus "{x}"? Video di kategori ini jadi tanpa kategori.',
    confirm_del_banner: 'Hapus banner ini?',
    session_expired: 'Sesi berakhir, silakan masuk kembali',
    load_error: 'Gagal memuat',
    added: 'Ditambahkan', updated: 'Diperbarui', deleted: 'Dihapus', saving: 'Menyimpan…',
    modal_video_add: 'Tambah Video', modal_video_edit: 'Ubah Video',
    modal_banner_add: 'Tambah Banner', modal_banner_edit: 'Ubah Banner',
    cover_regen: 'Buat sampul', cover_backfill: 'Lengkapi sampul', cover_done: 'Sampul diperbarui',
    cover_fail: 'Ekstraksi sampul gagal', cover_scheduled: '{x} tugas sampul diantrekan',
    uploading_banner: '⏳ Mengunggah media, harap tunggu…', no_pending_cover: 'Tak ada video tanpa sampul',
    backup_title: 'Cadangan Basis Data', backup_now: 'Cadangkan sekarang', backup_running: 'Mencadangkan…',
    backup_done: 'Cadangan selesai', backup_empty: 'Belum ada cadangan', th_size: 'Ukuran', backup_download: 'Unduh',
    backup_hint: 'Cadangan otomatis harian 02:00 ke R2, simpan 30 hari (set BACKUP_ENABLED=true di Railway)',
  },
};

/** 后台语言：localStorage 优先，其次浏览器 Accept-Language，默认英语 */
export function detectLang() {
  const saved = localStorage.getItem(LANG_KEY);
  if (saved && SUPPORTED_LANGS.includes(saved)) return saved;
  const nav = (navigator.language || navigator.userLanguage || '').toLowerCase();
  if (nav.startsWith('zh')) return 'zh';
  if (nav.startsWith('th')) return 'th';
  if (nav.startsWith('en')) return 'en';
  return DEFAULT_LANG;
}

/** 当前生效语言：运行时覆盖（如首页印尼语）优先，否则 detectLang */
export function getLang() { return _runtimeLang || detectLang(); }

/** 设置语言并持久化（不自动刷新，由调用方决定重渲染） */
export function setLang(lang) {
  if (SUPPORTED_LANGS.includes(lang)) localStorage.setItem(LANG_KEY, lang);
}

/** 翻译：缺失键回退到中文，再回退到键名本身 */
export function t(key) {
  const lang = getLang();
  return (I18N[lang] && I18N[lang][key]) || I18N.zh[key] || key;
}

/** 带占位符插值的翻译，如 t2('confirm_del_video', {x: title}) → 替换 {x} */
export function t2(key, vars = {}) {
  return t(key).replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : `{${k}}`));
}

/** URL 安全过滤：只允许 http(s):// 或 / 开头，否则返回 ''（防 javascript: 等 XSS） */
export function safeUrl(u) {
  if (!u) return '';
  const s = String(u).trim();
  return /^(https?:\/\/|\/)/i.test(s) ? s : '';
}

/**
 * HTML 转义：把视频标题/分类名等数据安全插入到 innerHTML / 属性值里。
 * 标题里含有 < > " ' & 时既不会破坏布局，也挡掉 onerror= 之类的注入。
 */
export function esc(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/**
 * 应用 i18n 到 DOM：
 *  - [data-i18n]      → textContent
 *  - [data-i18n-ph]   → placeholder
 *  - [data-i18n-title]→ title
 * 同时更新 <html lang>。
 */
export function applyI18n(root = document) {
  document.documentElement.lang = getLang();
  root.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  root.querySelectorAll('[data-i18n-ph]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPh);
  });
  root.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.title = t(el.dataset.i18nTitle);
  });
}

// ── 通用工具 ────────────────────────────────────────────────────────────────
export function fmtBytes(n) {
  if (!n) return '';
  if (n < 1024) return `${n} B`;
  if (n < 1048576) return `${(n/1024).toFixed(1)} KB`;
  if (n < 1073741824) return `${(n/1048576).toFixed(1)} MB`;
  return `${(n/1073741824).toFixed(2)} GB`;
}

export function debounce(fn, ms = 300) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); };
}

export function showToast(msg, type = 'info', stackId = 'toastStack') {
  const stack = document.getElementById(stackId);
  if (!stack) return;
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.textContent = msg;
  stack.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 300); }, 3000);
}

export function qs(key) {
  return new URLSearchParams(location.search).get(key);
}

// ── 交互动画初始化（滚动触发显现 + 视差 + 回到顶部）──────────────────────────
// 纯新增、自运行。滚动显现用 IntersectionObserver；含 5s 兜底强制显示，
// 任何情况下都不会让内容长期卡在隐藏态（杜绝白屏）。
(function initInteractions() {
  if (typeof document === 'undefined') return;
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 回到顶部按钮（动态注入，靠 window 滚动显隐；后台 window 不滚动则自然不出现）
  function setupBackToTop() {
    if (document.querySelector('.to-top')) return;
    const btn = document.createElement('button');
    btn.className = 'to-top'; btn.type = 'button'; btn.setAttribute('aria-label', '返回顶部');
    btn.innerHTML = '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5M5 12l7-7 7 7"/></svg>';
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));
    document.body.appendChild(btn);
    const onScroll = () => btn.classList.toggle('show', (window.scrollY || document.documentElement.scrollTop) > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // 滚动触发显现：进入视口才淡入上浮，依次延迟 0.05s
  const SEL = '.video-card:not(.skeleton-card), .tag, .side-cat, .dual-banner-item, .side-ad-item';
  function setupReveal() {
    if (reduce || !('IntersectionObserver' in window)) return;
    if (!document.querySelector('.video-grid, .dual-banner')) return;   // 仅前台页面启用

    const io = new IntersectionObserver((entries, obs) => {
      let k = 0;
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.style.transitionDelay = Math.min(k++ * 0.05, 0.4) + 's';
        e.target.classList.add('sr-in');
        obs.unobserve(e.target);
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });

    function register(els) {
      for (const el of els) {
        if (el.__sr) continue;
        el.__sr = true;
        el.classList.add('sr');
        io.observe(el);
      }
    }
    function targetsIn(node) {
      if (node.nodeType !== 1) return [];
      const out = [];
      if (node.matches && node.matches(SEL)) out.push(node);
      else if (node.closest) { const p = node.closest('.dual-banner-item'); if (p) out.push(p); }
      if (node.querySelectorAll) out.push(...node.querySelectorAll(SEL));
      return out;
    }
    const mo = new MutationObserver(muts => {
      const batch = [];
      for (const m of muts) for (const n of m.addedNodes) batch.push(...targetsIn(n));
      if (batch.length) register(batch);
    });
    mo.observe(document.body, { childList: true, subtree: true });
    register([...document.querySelectorAll(SEL)]);

    // 兜底：5 秒后强制显示任何仍隐藏的元素，绝不长期隐藏内容
    setTimeout(() => {
      document.querySelectorAll('.sr:not(.sr-in)').forEach(el => el.classList.add('sr-in'));
    }, 5000);
  }

  // 视差：背景光晕随滚动极轻微位移（rAF 节流 + 60px 上限）
  function setupParallax() {
    if (reduce) return;
    const bg = document.querySelector('.bg-aurora');
    if (!bg) return;
    let ticking = false;
    const update = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      bg.style.transform = 'translate3d(0,' + Math.min(y * 0.05, 60) + 'px,0)';
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
  }

  function start() { try { setupBackToTop(); setupReveal(); setupParallax(); } catch (_) {} }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();

// ── 右侧「下载 APP / 联系客服」按钮渲染 ──────────────────────────────────────
// 数据来自后端 settings 的 download_apps[] / contacts[]（每项 {name, url}）。
// 按链接/名称自动识别平台 → 配色 + 品牌图标：
//   下载：紫色（Google Play ▶ / App Store apple 图标）
//   客服：WhatsApp 绿 / Telegram 蓝 / 其它默认紫
const _ICONS = {
  download: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"/></svg>',
  apple: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M16.36 1.43c0 1.14-.42 2.2-1.12 3.02-.84.99-2.2 1.76-3.36 1.67-.14-1.13.43-2.32 1.08-3.06.74-.85 2.06-1.5 3.4-1.63zM20.5 17.06c-.6 1.38-.9 2-1.67 3.22-1.08 1.7-2.6 3.82-4.48 3.83-1.67.02-2.1-1.1-4.37-1.08-2.27.01-2.74 1.1-4.4 1.08-1.89-.02-3.33-1.93-4.4-3.63C-1.2 16.4-1.5 10.9.95 7.97 2.06 6.6 3.74 5.74 5.32 5.74c1.6 0 2.6 1.1 3.92 1.1 1.28 0 2.06-1.1 3.92-1.1 1.4 0 2.88.76 3.94 2.08-3.46 1.9-2.9 6.84.4 8.24z"/></svg>',
  play: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M3.6 2.2a1 1 0 00-.6.92v17.76a1 1 0 001.54.84l11-6.55-3.02-3.02L3.6 2.2zm14.9 8.05l-2.55 1.52-3.07-3.07 2.53-1.5 3.09 1.84c.9.54.9 1.86 0 2.4zM5.4 21.1l8.06-4.8-2.78-2.78L5.4 18.9v2.2z"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M.06 24l1.69-6.16A11.9 11.9 0 010 11.9C0 5.33 5.34 0 11.9 0c3.18 0 6.17 1.24 8.4 3.49a11.8 11.8 0 013.48 8.41c0 6.56-5.34 11.9-11.9 11.9-2.02 0-3.98-.51-5.7-1.45L.06 24zM6.6 20.13c1.68.99 3.28 1.58 5.3 1.58 5.45 0 9.9-4.43 9.9-9.88 0-5.46-4.44-9.9-9.9-9.9-5.45 0-9.88 4.44-9.88 9.9 0 2.13.62 3.72 1.66 5.4l-1 3.65 3.92-1.75zm11.3-5.6c-.07-.12-.27-.2-.56-.34-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.66.15-.2.3-.76.96-.93 1.16-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.34.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.66-1.6-.9-2.18-.24-.58-.48-.5-.66-.5l-.56-.01c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.07 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.42.25-.7.25-1.28.18-1.4z"/></svg>',
  telegram: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M22.05 1.58L1.93 9.36c-1.37.55-1.36 1.32-.25 1.66l5.16 1.61 1.99 6.1c.24.66.12.92.81.92.53 0 .77-.24 1.06-.53l2.55-2.48 5.3 3.92c.98.54 1.68.26 1.92-.9l3.48-16.4c.36-1.42-.53-2.07-1.45-1.68z"/></svg>',
  chat: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>',
};
const _ARROW = '<svg class="app-btn__arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M9 7h8v8"/></svg>';

function _btnStyle(kind, url, name) {
  const s = `${url || ''} ${name || ''}`.toLowerCase();
  if (kind === 'download') {
    const icon = /apple|app ?store|itunes|ios/.test(s) ? _ICONS.apple
               : /play\.google|google ?play|android|\.apk/.test(s) ? _ICONS.play
               : _ICONS.download;
    return { cls: 'app-btn--download', icon };
  }
  if (/wa\.me|whatsapp|chat\.whatsapp/.test(s)) return { cls: 'app-btn--whatsapp', icon: _ICONS.whatsapp };
  if (/t\.me|telegram|tg:\/\//.test(s))          return { cls: 'app-btn--telegram', icon: _ICONS.telegram };
  return { cls: 'app-btn--contact', icon: _ICONS.chat };
}

/**
 * 渲染右侧下载/客服按钮到 root 容器。
 * downloads / contacts 为 [{name,url}]；返回是否渲染了至少一个按钮。
 */
export function renderSideButtons(downloads, contacts, root) {
  if (!root) return false;
  const make = (item, kind) => {
    const url = safeUrl(item && item.url);
    if (!url) return '';
    const { cls, icon } = _btnStyle(kind, item.url, item.name);
    const label = esc(((item.name || '').trim()) || (kind === 'download' ? t('download_app') : t('contact_us')));
    return `<a class="app-btn ${cls}" href="${esc(url)}" target="_blank" rel="noopener" title="${label}">
      <span class="app-btn__icon">${icon}</span>
      <span class="app-btn__text">${label}</span>
      ${_ARROW}
    </a>`;
  };
  const dl = (downloads || []).map(d => make(d, 'download')).filter(Boolean);
  const ct = (contacts || []).map(c => make(c, 'contact')).filter(Boolean);
  if (!dl.length && !ct.length) { root.innerHTML = ''; return false; }
  root.innerHTML =
    (dl.length ? `<div class="app-btn-group">${dl.join('')}</div>` : '') +
    (ct.length ? `<div class="app-btn-group">${ct.join('')}</div>` : '');
  return true;
}
