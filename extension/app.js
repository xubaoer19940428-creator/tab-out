/* ================================================================
   Tab Out — Dashboard App (Pure Extension Edition v1.3.0)
   ================================================================ */

'use strict';

/* ----------------------------------------------------------------
   I18N — Internationalization (Chinese & English Support)
   ---------------------------------------------------------------- */

const I18N = {
  'zh-CN': {
    goodMorning: '早上好',
    goodAfternoon: '下午好',
    goodEvening: '晚上好',
    goodNight: '晚安',
    goodDay: '你好',
    findAnything: '全局搜索',
    searchPlaceholder: '搜索打开的标签、收藏链接、工作区…',
    addWeather: '添加天气',
    chooseCity: '选择城市',
    localTime: '本地时间',
    personalize: '个性化设置',
    workspaces: '工作区',
    savedSetups: '已保存环境',
    saveThisDesk: '保存当前桌面',
    workspaceName: '工作区名称',
    workspacePlaceholder: '例如：周一调研项目',
    save: '保存',
    cancel: '取消',
    rightNow: '当前打开',
    savedForLater: '稍后阅读',
    nothingSaved: '暂无收藏，活在当下。',
    archive: '归档',
    searchArchived: '搜索归档标签…',
    closeAllTabs: '关闭全部 {count} 个标签',
    closeDupes: '清理 {count} 个重复标签',
    tabOpen: '{count} 个标签打开',
    duplicates: '{count} 个重复项',
    domainCount: '{count} 个域名',
    freezeInactive: '释放内存 (休眠后台标签)',
    freezeDone: '已休眠 {count} 个后台标签以释放 RAM 内存',
    exportSuccess: '工作区与配置已成功导出为 JSON',
    importSuccess: '已成功导入 {workspaces} 个工作区与 {saved} 个稍后阅读',
    importError: '导入失败：备份文件格式不符合规范',
    tabClosed: '标签已关闭',
    tabSaved: '已收藏至稍后阅读',
    tabMuted: '标签已静音',
    tabUnmuted: '标签已取消静音',
    undo: '撤销',
    undoShortcut: '撤销 ⌘Z',
    tabRestored: '已成功恢复关闭的标签',
    expandMore: '展开其余 {count} 个标签 ▾',
    collapse: '收起 ▴',
    discardedTooltip: '已休眠 (节省内存)',
    muteTooltip: '静音此标签',
    unmuteTooltip: '取消静音',
    justNow: '刚刚',
    minAgo: '{min} 分钟前',
    hrAgo: '{hr} 小时前',
    yesterday: '昨天',
    daysAgo: '{days} 天前',
    deskUpdated: '桌面个性化设置已更新',
    actionDiscardCmd: '⚡ 释放内存：休眠所有后台非活跃标签',
    actionExportCmd: '💾 导出备份：下载工作区与待办 JSON',
    actionDedupCmd: '✨ 一键去重：清理所有重复标签',
  },
  'en': {
    goodMorning: 'Good morning',
    goodAfternoon: 'Good afternoon',
    goodEvening: 'Good evening',
    goodNight: 'Good night',
    goodDay: 'Good day',
    findAnything: 'Find anything',
    searchPlaceholder: 'Search tabs, saved links, workspaces…',
    addWeather: 'Add weather',
    chooseCity: 'Choose a city',
    localTime: 'Local time',
    personalize: 'Personalize',
    workspaces: 'Workspaces',
    savedSetups: 'Saved setups',
    saveThisDesk: 'Save this desk',
    workspaceName: 'Workspace name',
    workspacePlaceholder: 'e.g. Monday research',
    save: 'Save',
    cancel: 'Cancel',
    rightNow: 'Right now',
    savedForLater: 'Saved for later',
    nothingSaved: 'Nothing saved. Living in the moment.',
    archive: 'Archive',
    searchArchived: 'Search archived tabs...',
    closeAllTabs: 'Close all {count} tabs',
    closeDupes: 'Close {count} duplicates',
    tabOpen: '{count} tabs open',
    duplicates: '{count} duplicates',
    domainCount: '{count} domains',
    freezeInactive: 'Free up memory (Freeze inactive tabs)',
    freezeDone: 'Suspended {count} inactive background tabs to save RAM',
    exportSuccess: 'Workspaces and links exported successfully',
    importSuccess: 'Successfully imported {workspaces} workspaces and {saved} saved tabs',
    importError: 'Invalid backup file format',
    tabClosed: 'Tab closed',
    tabSaved: 'Saved for later',
    tabMuted: 'Tab muted',
    tabUnmuted: 'Tab unmuted',
    undo: 'Undo',
    undoShortcut: 'Undo ⌘Z',
    tabRestored: 'Tabs restored successfully',
    expandMore: 'Show {count} more ▾',
    collapse: 'Collapse ▴',
    discardedTooltip: 'Sleeping to save RAM',
    muteTooltip: 'Mute this tab',
    unmuteTooltip: 'Unmute tab',
    justNow: 'just now',
    minAgo: '{min} min ago',
    hrAgo: '{hr} hrs ago',
    yesterday: 'yesterday',
    daysAgo: '{days} days ago',
    deskUpdated: 'Your desk is updated',
    actionDiscardCmd: '⚡ Free memory: Freeze inactive background tabs',
    actionExportCmd: '💾 Export backup: Download workspaces & links as JSON',
    actionDedupCmd: '✨ Clean duplicates: Keep only one of duplicate tabs',
  }
};

function getCurrentLanguage() {
  const pref = (typeof preferences !== 'undefined' && preferences?.language) || 'auto';
  if (pref === 'zh-CN' || pref === 'zh') return 'zh-CN';
  if (pref === 'en') return 'en';
  const nav = (typeof navigator !== 'undefined' && (navigator.language || navigator.userLanguage) || '').toLowerCase();
  return nav.startsWith('zh') ? 'zh-CN' : 'en';
}

function t(key, params = {}) {
  const lang = getCurrentLanguage();
  const dict = I18N[lang] || I18N['en'];
  let str = dict[key] || I18N['en'][key] || key;
  for (const [k, v] of Object.entries(params)) {
    str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
  }
  return str;
}

/* ----------------------------------------------------------------
   CHROME TABS — Direct API Access
   ---------------------------------------------------------------- */

// All open tabs — populated by fetchOpenTabs()
let openTabs = [];

const WORKSPACES_KEY = 'tabOutWorkspaces';
const MAX_WORKSPACES = 16;
const MAX_WORKSPACE_TABS = 80;
let workspaces = [];
const restoringWorkspaceIds = new Set();
let commandItems = [];
let commandSelection = 0;
let commandTrigger = null;
let workspaceFormTrigger = null;
let localWorkspaceQueue = Promise.resolve();
let commandInertElements = [];

// Undo history and Accordion state
const lastClosedBatches = [];
const expandedDomainKeys = new Set();
let toastTimeoutId = null;

function recordClosedTabs(tabs) {
  if (!tabs || tabs.length === 0) return;
  lastClosedBatches.push(tabs.map(t => ({
    url: t.url,
    title: t.title || t.url,
    windowId: t.windowId,
  })));
  if (lastClosedBatches.length > 20) lastClosedBatches.shift();
}

async function undoLastClosed() {
  if (lastClosedBatches.length === 0) {
    if (chrome.sessions && typeof chrome.sessions.restore === 'function') {
      try {
        await chrome.sessions.restore();
        showToast(t('tabRestored'));
        await renderStaticDashboard();
        return;
      } catch {}
    }
    return;
  }

  const batch = lastClosedBatches.pop();

  if (chrome.sessions && typeof chrome.sessions.restore === 'function') {
    try {
      for (let i = 0; i < batch.length; i++) {
        await chrome.sessions.restore();
      }
    } catch {}
  }

  const currentTabs = await chrome.tabs.query({});
  const currentUrlSet = new Set(currentTabs.map(t => t.url));

  for (const item of batch) {
    if (item.url && !currentUrlSet.has(item.url)) {
      try {
        await chrome.tabs.create({ url: item.url, active: false });
        currentUrlSet.add(item.url);
      } catch (err) {
        console.warn('[tab-out] Could not reopen tab:', item.url, err);
      }
    }
  }

  hideToast();
  showToast(t('tabRestored'));
  await renderStaticDashboard();
}

/**
 * fetchOpenTabs()
 *
 * Reads all currently open browser tabs directly from Chrome.
 * Captures audible, muted, and discarded (memory saver) state.
 */
async function fetchOpenTabs() {
  try {
    const extensionId = chrome.runtime.id;
    const newtabUrl = `chrome-extension://${extensionId}/index.html`;

    const tabs = await chrome.tabs.query({});
    openTabs = tabs.map(t => ({
      id:         t.id,
      url:        t.url,
      title:      t.title,
      windowId:   t.windowId,
      active:     t.active,
      favIconUrl: t.favIconUrl || '',
      audible:    Boolean(t.audible),
      muted:      Boolean(t.mutedInfo?.muted),
      discarded:  Boolean(t.discarded),
      isTabOut:   t.url === newtabUrl || t.url === 'chrome://newtab/',
    }));
  } catch {
    openTabs = [];
  }
}

/**
 * closeTabsByUrls(urls)
 *
 * Closes all open tabs whose hostname matches any of the given URLs.
 * After closing, re-fetches the tab list to keep our state accurate.
 *
 * Special case: file:// URLs are matched exactly (they have no hostname).
 */
async function closeTabsByUrls(urls) {
  if (!urls || urls.length === 0) return;

  // Separate file:// URLs (exact match) from regular URLs (hostname match)
  const targetHostnames = [];
  const exactUrls = new Set();

  for (const u of urls) {
    if (u.startsWith('file://')) {
      exactUrls.add(u);
    } else {
      try { targetHostnames.push(new URL(u).hostname); }
      catch { /* skip unparseable */ }
    }
  }

  const allTabs = await chrome.tabs.query({});
  const toClose = allTabs
    .filter(tab => {
      const tabUrl = tab.url || '';
      if (tabUrl.startsWith('file://') && exactUrls.has(tabUrl)) return true;
      try {
        const tabHostname = new URL(tabUrl).hostname;
        return tabHostname && targetHostnames.includes(tabHostname);
      } catch { return false; }
    })
    .map(tab => tab.id);

  if (toClose.length > 0) await chrome.tabs.remove(toClose);
  await fetchOpenTabs();
}

/**
 * closeTabsExact(urls)
 *
 * Closes tabs by exact URL match (not hostname). Used for landing pages
 * so closing "Gmail inbox" doesn't also close individual email threads.
 */
async function closeTabsExact(urls) {
  if (!urls || urls.length === 0) return;
  const urlSet = new Set(urls);
  const allTabs = await chrome.tabs.query({});
  const toClose = allTabs.filter(t => urlSet.has(t.url)).map(t => t.id);
  if (toClose.length > 0) await chrome.tabs.remove(toClose);
  await fetchOpenTabs();
}

/**
 * focusTab(url)
 *
 * Switches Chrome to the tab with the given URL (exact match first,
 * then hostname fallback). Also brings the window to the front.
 */
async function focusTab(url) {
  if (!url) return;
  const allTabs = await chrome.tabs.query({});
  const currentWindow = await chrome.windows.getCurrent();

  // Try exact URL match first
  let matches = allTabs.filter(t => t.url === url);

  // Fall back to hostname match
  if (matches.length === 0) {
    try {
      const targetHost = new URL(url).hostname;
      matches = allTabs.filter(t => {
        try { return new URL(t.url).hostname === targetHost; }
        catch { return false; }
      });
    } catch {}
  }

  if (matches.length === 0) return;

  // Prefer a match in a different window so it actually switches windows
  const match = matches.find(t => t.windowId !== currentWindow.id) || matches[0];
  await chrome.tabs.update(match.id, { active: true });
  await chrome.windows.update(match.windowId, { focused: true });
}

async function focusTabById(tabId, windowId, fallbackUrl) {
  try {
    await chrome.tabs.update(tabId, { active: true });
    await chrome.windows.update(windowId, { focused: true });
  } catch {
    await focusTab(fallbackUrl);
  }
}

/**
 * closeDuplicateTabs(urls, keepOne)
 *
 * Closes duplicate tabs for the given list of URLs.
 * keepOne=true → keep one copy of each, close the rest.
 * keepOne=false → close all copies.
 */
async function closeDuplicateTabs(urls, keepOne = true) {
  const allTabs = await chrome.tabs.query({});
  const toClose = [];

  for (const url of urls) {
    const matching = allTabs.filter(t => t.url === url);
    if (keepOne) {
      const keep = matching.find(t => t.active) || matching[0];
      for (const tab of matching) {
        if (tab.id !== keep.id) toClose.push(tab.id);
      }
    } else {
      for (const tab of matching) toClose.push(tab.id);
    }
  }

  if (toClose.length > 0) await chrome.tabs.remove(toClose);
  await fetchOpenTabs();
}

/**
 * closeTabOutDupes()
 *
 * Closes all duplicate Tab Out new-tab pages except the current one.
 */
async function closeTabOutDupes() {
  const extensionId = chrome.runtime.id;
  const newtabUrl = `chrome-extension://${extensionId}/index.html`;

  const allTabs = await chrome.tabs.query({});
  const currentWindow = await chrome.windows.getCurrent();
  const tabOutTabs = allTabs.filter(t =>
    t.url === newtabUrl || t.url === 'chrome://newtab/'
  );

  if (tabOutTabs.length <= 1) return;

  // Keep the active Tab Out tab in the CURRENT window — that's the one the
  // user is looking at right now. Falls back to any active one, then the first.
  const keep =
    tabOutTabs.find(t => t.active && t.windowId === currentWindow.id) ||
    tabOutTabs.find(t => t.active) ||
    tabOutTabs[0];
  const toClose = tabOutTabs.filter(t => t.id !== keep.id).map(t => t.id);
  if (toClose.length > 0) await chrome.tabs.remove(toClose);
  await fetchOpenTabs();
}


/* ----------------------------------------------------------------
   SAVED FOR LATER — chrome.storage.local

   Replaces the old server-side SQLite + REST API with Chrome's
   built-in key-value storage. Data persists across browser sessions
   and doesn't require a running server.

   Data shape stored under the "deferred" key:
   [
     {
       id: "1712345678901",          // timestamp-based unique ID
       url: "https://example.com",
       title: "Example Page",
       savedAt: "2026-04-04T10:00:00.000Z",  // ISO date string
       completed: false,             // true = checked off (archived)
       dismissed: false              // true = dismissed without reading
     },
     ...
   ]
   ---------------------------------------------------------------- */

/**
 * saveTabForLater(tab)
 *
 * Saves a single tab to the "Saved for Later" list in chrome.storage.local.
 * @param {{ url: string, title: string }} tab
 */
async function saveTabForLater(tab) {
  const { deferred = [] } = await chrome.storage.local.get('deferred');
  deferred.push({
    id:        Date.now().toString(),
    url:       tab.url,
    title:     tab.title,
    savedAt:   new Date().toISOString(),
    completed: false,
    dismissed: false,
  });
  await chrome.storage.local.set({ deferred });
}

/**
 * getSavedTabs()
 *
 * Returns all saved tabs from chrome.storage.local.
 * Filters out dismissed items (those are gone for good).
 * Splits into active (not completed) and archived (completed).
 */
async function getSavedTabs() {
  const { deferred = [] } = await chrome.storage.local.get('deferred');
  const visible = deferred.filter(t => !t.dismissed);
  return {
    active:   visible.filter(t => !t.completed),
    archived: visible.filter(t => t.completed),
  };
}

/**
 * checkOffSavedTab(id)
 *
 * Marks a saved tab as completed (checked off). It moves to the archive.
 */
async function checkOffSavedTab(id) {
  const { deferred = [] } = await chrome.storage.local.get('deferred');
  const tab = deferred.find(t => t.id === id);
  if (tab) {
    tab.completed = true;
    tab.completedAt = new Date().toISOString();
    await chrome.storage.local.set({ deferred });
  }
}

/**
 * dismissSavedTab(id)
 *
 * Marks a saved tab as dismissed (removed from all lists).
 */
async function dismissSavedTab(id) {
  const { deferred = [] } = await chrome.storage.local.get('deferred');
  const tab = deferred.find(t => t.id === id);
  if (tab) {
    tab.dismissed = true;
    await chrome.storage.local.set({ deferred });
  }
}


/* ----------------------------------------------------------------
   WORKSPACES — named, local snapshots of the current desk
   ---------------------------------------------------------------- */

function isWorkspaceUrl(url) {
  try {
    return ['http:', 'https:', 'file:'].includes(new URL(url).protocol);
  } catch {
    return false;
  }
}

async function loadWorkspaces() {
  const stored = await chrome.storage.local.get(WORKSPACES_KEY);
  workspaces = normalizeWorkspaces(stored[WORKSPACES_KEY]);
  return workspaces;
}

function normalizeWorkspaces(value) {
  return Array.isArray(value)
    ? value
      .filter(item => item && typeof item.id === 'string' && typeof item.name === 'string' && Array.isArray(item.tabs))
      .map(item => ({
        ...item,
        tabs: item.tabs
          .filter(tab => tab && isWorkspaceUrl(tab.url))
          .map(tab => ({ title: String(tab.title || tab.url).slice(0, 300), url: String(tab.url) })),
      }))
    : [];
}

function withWorkspaceLock(name, task) {
  if (typeof navigator !== 'undefined' && navigator.locks?.request) {
    return navigator.locks.request(name, task);
  }

  const run = localWorkspaceQueue.then(task, task);
  localWorkspaceQueue = run.catch(() => {});
  return run;
}

async function saveCurrentWorkspace(name) {
  const cleanName = String(name || '').trim().replace(/\s+/g, ' ');
  if (!cleanName) throw new Error('Give this workspace a name');

  await fetchOpenTabs();
  const seen = new Set();
  const eligibleTabs = getRealTabs()
    .filter(tab => isWorkspaceUrl(tab.url) && !seen.has(tab.url) && seen.add(tab.url))
    .map(tab => ({
      title: String(tab.title || tab.url).slice(0, 300),
      url: tab.url,
    }));

  if (eligibleTabs.length === 0) throw new Error('There are no web tabs to save');
  if (eligibleTabs.length > MAX_WORKSPACE_TABS) {
    throw new Error(`A workspace can hold up to ${MAX_WORKSPACE_TABS} tabs`);
  }
  const tabs = eligibleTabs;

  return withWorkspaceLock('tab-out-workspace-mutations', async () => {
    await loadWorkspaces();
    if (workspaces.length >= MAX_WORKSPACES) {
      throw new Error(`You can keep up to ${MAX_WORKSPACES} workspaces — remove one first`);
    }
    const workspace = {
      id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: cleanName.slice(0, 60),
      createdAt: new Date().toISOString(),
      tabs,
    };
    workspaces = [workspace, ...workspaces];
    await chrome.storage.local.set({ [WORKSPACES_KEY]: workspaces });
    return workspace;
  });
}

async function restoreWorkspace(id) {
  if (restoringWorkspaceIds.has(id)) return { opened: 0, skipped: 0, failed: 0, busy: true };
  restoringWorkspaceIds.add(id);

  try {
    return await withWorkspaceLock('tab-out-workspace-restores', async () => {
      await loadWorkspaces();
      const workspace = workspaces.find(item => item.id === id);
      if (!workspace) return { opened: 0, skipped: 0, failed: 0, missing: true };

      const currentTabs = await chrome.tabs.query({});
      const openUrls = new Set(
        currentTabs.flatMap(tab => [tab.url, tab.pendingUrl]).filter(Boolean)
      );
      const uniqueUrls = [...new Set((workspace.tabs || []).map(tab => tab.url).filter(isWorkspaceUrl))];
      const urlsToOpen = uniqueUrls.filter(url => !openUrls.has(url));

      let opened = 0;
      let failed = 0;
      for (const url of urlsToOpen) {
        try {
          await chrome.tabs.create({ url, active: false });
          openUrls.add(url);
          opened += 1;
        } catch (error) {
          failed += 1;
          console.warn('[tab-out] Could not restore workspace tab:', url, error);
        }
      }
      return { opened, skipped: uniqueUrls.length - urlsToOpen.length, failed };
    });
  } finally {
    restoringWorkspaceIds.delete(id);
  }
}

async function deleteWorkspace(id) {
  await withWorkspaceLock('tab-out-workspace-mutations', async () => {
    await loadWorkspaces();
    workspaces = workspaces.filter(item => item.id !== id);
    await chrome.storage.local.set({ [WORKSPACES_KEY]: workspaces });
  });
}

function workspaceRestoreMessage(result) {
  if (result.busy) return 'That workspace is already restoring';
  if (result.missing) return 'That workspace no longer exists';
  if (result.failed && !result.opened) return `Could not open ${result.failed} tab${result.failed === 1 ? '' : 's'}`;
  if (result.opened && result.failed) return `Opened ${result.opened}; ${result.failed} could not be opened`;
  if (result.opened) return `Opened ${result.opened} missing tab${result.opened === 1 ? '' : 's'}`;
  return 'That workspace is already open';
}

chrome.storage.onChanged?.addListener((changes, areaName) => {
  if (areaName !== 'local' || !changes[WORKSPACES_KEY]) return;
  workspaces = normalizeWorkspaces(changes[WORKSPACES_KEY].newValue);
  renderWorkspaceShelf();
});

function renderWorkspaceShelf() {
  const list = document.getElementById('workspaceList');
  if (!list) return;

  if (workspaces.length === 0) {
    list.innerHTML = '<p class="workspace-empty">Pin a useful tab setup here for another day.</p>';
    return;
  }

  list.innerHTML = workspaces.map((workspace, index) => {
    const tabCount = Array.isArray(workspace.tabs) ? workspace.tabs.length : 0;
    const tone = (index % 4) + 1;
    return `
      <article class="workspace-card workspace-tone-${tone}">
        <button class="workspace-main" type="button" data-action="restore-workspace" data-workspace-id="${escapeHtml(workspace.id)}">
          <span class="workspace-pin" aria-hidden="true"></span>
          <strong>${escapeHtml(workspace.name)}</strong>
          <span>${tabCount} tab${tabCount === 1 ? '' : 's'} · restore missing only</span>
        </button>
        <button class="workspace-delete" type="button" data-action="delete-workspace" data-workspace-id="${escapeHtml(workspace.id)}" aria-label="Delete ${escapeHtml(workspace.name)}" title="Delete workspace">
          ${ICONS.close}
        </button>
      </article>`;
  }).join('');
}

function closeWorkspaceForm(restoreFocus = true) {
  const form = document.getElementById('workspaceForm');
  if (form) form.hidden = true;
  if (restoreFocus && typeof workspaceFormTrigger?.focus === 'function') workspaceFormTrigger.focus();
  workspaceFormTrigger = null;
}


/* ----------------------------------------------------------------
   PLAYFUL SUITE: Web Audio Synthesizer, Mascot, Woodfish & Arcade
   ---------------------------------------------------------------- */

/**
 * playAudioEffect(type)
 * Web Audio API synthesizer — 100% code generated, zero external audio assets.
 */
function playAudioEffect(type) {
  if (preferences && preferences.soundEnabled === false) return;
  const pack = type || (preferences?.soundPack || 'swoosh');

  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const t = ctx.currentTime;

    if (pack === 'bubble') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, t);
      osc.frequency.exponentialRampToValueAtTime(1400, t + 0.08);
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.08);
    } else if (pack === 'mech') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, t);
      osc.frequency.exponentialRampToValueAtTime(300, t + 0.04);
      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.04);
    } else if (pack === 'arcade') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(987.77, t);
      osc.frequency.setValueAtTime(1318.51, t + 0.08);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.25);
    } else if (pack === 'laser') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1600, t);
      osc.frequency.exponentialRampToValueAtTime(120, t + 0.15);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.15);
    } else if (pack === 'woodfish') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, t);
      osc.frequency.exponentialRampToValueAtTime(180, t + 0.12);
      gain.gain.setValueAtTime(0.5, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.12);
    } else if (pack === 'purr') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(80, t);
      osc.frequency.linearRampToValueAtTime(120, t + 0.15);
      osc.frequency.linearRampToValueAtTime(70, t + 0.3);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.linearRampToValueAtTime(0.001, t + 0.3);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.3);
    } else {
      const duration = 0.25;
      const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        const pos = i / data.length;
        const env = pos < 0.1 ? pos / 0.1 : Math.pow(1 - (pos - 0.1) / 0.9, 1.5);
        data[i] = (Math.random() * 2 - 1) * env;
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.value = 2.0;
      filter.frequency.setValueAtTime(4000, t);
      filter.frequency.exponentialRampToValueAtTime(400, t + duration);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
      source.connect(filter).connect(gain).connect(ctx.destination);
      source.start(t);
    }

    setTimeout(() => ctx.close(), 600);
  } catch {}
}

function playCloseSound() {
  playAudioEffect();
}

/* ================================================================
   1. MASCOT MANAGER (桌面情绪宠物)
   ================================================================ */
let mascotPetCount = 0;
let mascotPetTimer = null;

const MASCOT_QUOTES = {
  chill: [
    '活在当下，桌面真整洁 ✨',
    '一杯咖啡，惬意的一天 ☕',
    '标签刚刚好，心情美滋滋~',
    'Chill vibes only. Keep it neat.',
  ],
  busy: [
    '正在全速运转中，加油打工人！💪',
    '代码敲得飞起，冲冲冲！🚀',
    '这么多标签，你是在摸鱼还是在干大事？👀',
    'Focus mode on! You got this.',
  ],
  overloaded: [
    '老板救命！标签大山要把我压扁啦 🚨',
    '电脑内存要冒烟了！点我帮你释放内存 ⚡',
    '开了这么多标签，真的看得过来吗 😭',
    'Tab overload! Time to clean up.',
  ],
  dj: [
    '这首歌太带感了，跟着节奏摇摆 🎧🎵',
    '音乐不息，编码不止 ♫',
    'DJ in the house! Drop the beat 🎶',
  ]
};

const CAT_COAT_COLORS = ['orange', 'white', 'black', 'silver', 'siamese', 'pink'];
const CAT_COAT_NAMES = {
  orange: '🍊 活力暖橘',
  white: '🥛 纯洁雪白',
  black: '🖤 黑曜石黑',
  silver: '🐾 美短银虎斑',
  siamese: '☕ 焦糖暹罗',
  pink: '🌸 樱花赛博'
};

function updateMascotState() {
  const island = document.getElementById('mascotIsland');
  const charEl = document.getElementById('mascotCharacter');
  const liveCat = document.getElementById('liveCat');
  const bubbleText = document.getElementById('mascotBubbleText');
  const quickAction = document.getElementById('mascotQuickAction');
  if (!island || !charEl) return;

  if (preferences && preferences.mascotEnabled === false) {
    island.classList.add('is-hidden');
    return;
  }
  island.classList.remove('is-hidden');

  if (liveCat) {
    liveCat.dataset.catColor = preferences?.catColor || 'orange';
  }

  const tabCount = openTabs.filter(t => !t.isTabOut).length;
  const isPlayingAudio = openTabs.some(t => t.audible);

  charEl.classList.remove('is-typing', 'is-overloaded', 'is-dj');

  let state = 'chill';
  if (isPlayingAudio) {
    state = 'dj';
    charEl.classList.add('is-dj');
  } else if (tabCount > 18) {
    state = 'overloaded';
    charEl.classList.add('is-overloaded');
  } else if (tabCount >= 7) {
    state = 'busy';
    charEl.classList.add('is-typing');
  } else {
    state = 'chill';
  }

  if (bubbleText) {
    const list = MASCOT_QUOTES[state] || MASCOT_QUOTES.chill;
    bubbleText.textContent = list[Math.floor(Math.random() * list.length)];
  }

  if (quickAction) {
    if (state === 'overloaded') {
      quickAction.textContent = '⚡ 释放内存';
      quickAction.style.display = 'inline-flex';
      quickAction.onclick = async (e) => {
        e.stopPropagation();
        await discardInactiveTabs();
      };
    } else {
      quickAction.style.display = 'none';
      quickAction.onclick = null;
    }
  }
}

/* ================================================================
   3D SPATIAL INTERACTION & HEAD/EYE TRACKING ENGINE
   ================================================================ */
let catTargetRotX = 0;
let catTargetRotY = 0;
let catCurrentRotX = 0;
let catCurrentRotY = 0;
let catTargetEyeX = 0;
let catTargetEyeY = 0;
let catCurrentEyeX = 0;
let catCurrentEyeY = 0;
let isCat3DActive = true;

function initCat3DTracking() {
  const stage = document.getElementById('mascotStage');
  const charEl = document.getElementById('mascotCharacter');
  if (!stage || !charEl) return;

  window.addEventListener('mousemove', (e) => {
    if (!isCat3DActive) return;
    const rect = stage.getBoundingClientRect();
    const catCenterX = rect.left + rect.width / 2;
    const catCenterY = rect.top + rect.height / 2;

    const dx = e.clientX - catCenterX;
    const dy = e.clientY - catCenterY;

    // Calculate angles: rotateY follows X horizontal, rotateX follows Y vertical
    const maxRotX = 22; // pitch up/down
    const maxRotY = 32; // yaw left/right

    const distanceX = dx / window.innerWidth;
    const distanceY = dy / window.innerHeight;

    catTargetRotY = Math.max(-maxRotY, Math.min(maxRotY, distanceX * maxRotY * 1.8));
    catTargetRotX = Math.max(-maxRotX, Math.min(maxRotX, -distanceY * maxRotX * 1.8));

    // Pupils parallax shift
    catTargetEyeX = Math.max(-3.5, Math.min(3.5, distanceX * 6));
    catTargetEyeY = Math.max(-2.5, Math.min(2.5, distanceY * 5));
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    catTargetRotX = 0;
    catTargetRotY = 0;
    catTargetEyeX = 0;
    catTargetEyeY = 0;
  });

  // 60FPS Lerp Update Loop for buttery smooth spring tracking
  function updateCat3DLoop() {
    const lerpFactor = 0.12;
    catCurrentRotX += (catTargetRotX - catCurrentRotX) * lerpFactor;
    catCurrentRotY += (catTargetRotY - catCurrentRotY) * lerpFactor;
    catCurrentEyeX += (catTargetEyeX - catCurrentEyeX) * lerpFactor;
    catCurrentEyeY += (catTargetEyeY - catCurrentEyeY) * lerpFactor;

    if (charEl) {
      charEl.style.setProperty('--cat-rot-x', `${catCurrentRotX.toFixed(2)}deg`);
      charEl.style.setProperty('--cat-rot-y', `${catCurrentRotY.toFixed(2)}deg`);
      charEl.style.setProperty('--cat-eye-x', `${catCurrentEyeX.toFixed(2)}px`);
      charEl.style.setProperty('--cat-eye-y', `${catCurrentEyeY.toFixed(2)}px`);
    }

    requestAnimationFrame(updateCat3DLoop);
  }

  requestAnimationFrame(updateCat3DLoop);
}

async function cycleCatColor() {
  const current = preferences?.catColor || 'orange';
  const nextIdx = (CAT_COAT_COLORS.indexOf(current) + 1) % CAT_COAT_COLORS.length;
  const nextColor = CAT_COAT_COLORS[nextIdx];

  preferences.catColor = nextColor;
  try {
    await chrome.storage.local.set({ [PREFERENCES_KEY]: preferences });
  } catch {}

  updateMascotState();
  playAudioEffect('bubble');
  showToast(`✨ 猫咪换上了【${CAT_COAT_NAMES[nextColor]}】毛色！`);
}

function petMascot(e) {
  const charEl = document.getElementById('mascotCharacter');
  if (!charEl) return;

  playAudioEffect('purr');
  charEl.classList.add('is-jumping');
  setTimeout(() => charEl.classList.remove('is-jumping'), 700);

  mascotPetCount++;
  if (mascotPetTimer) clearTimeout(mascotPetTimer);
  mascotPetTimer = setTimeout(() => { mascotPetCount = 0; }, 2000);

  // If rapid 5 clicks, trigger coat cycle!
  if (mascotPetCount === 5) {
    cycleCatColor();
  }

  // Spawn floating heart particles
  const rect = charEl.getBoundingClientRect();
  const particle = document.createElement('div');
  particle.className = 'mascot-particle';
  particle.textContent = mascotPetCount >= 3 ? '💖' : '✨';
  particle.style.left = `${rect.left + 15 + (Math.random() * 20 - 10)}px`;
  particle.style.top = `${rect.top - 10}px`;
  document.body.appendChild(particle);
  setTimeout(() => particle.remove(), 900);

  // Random humorous speech on click
  const bubbleText = document.getElementById('mascotBubbleText');
  if (bubbleText) {
    const funQuotes = [
      '喵呜~ 摸摸很舒服！🐱',
      '摸头+1，Bug-1，今天注定写出优雅代码！✨',
      '你已经摸了我 ' + mascotPetCount + ' 次啦，快去完成任务吧！',
      'Purr~ Keep up the great work!',
      '赛博小猫正在为您祈福：编译一次过！🙏',
    ];
    bubbleText.textContent = funQuotes[Math.floor(Math.random() * funQuotes.length)];
  }
}

/* ================================================================
   2. CYBER WOODFISH & DAILY ORACLE (赛博木鱼与每日极客神签)
   ================================================================ */
let woodfishKnocks = 0;

const GEEK_FORTUNES = [
  '今日宜：重构陈旧模块；忌：在没有备份的情况下直接改生产环境。',
  '今日宜：给变量起一个极具诗意的名字；忌：在单测中直接写 expect(true).toBe(true)。',
  '今日宜：整理 3 天前的标签；忌：下班前 5 分钟提交大规模 PR。',
  '今日宜：喝一杯热咖啡后优雅 Debug；忌：向产品经理妥协第 10 个修改要求。',
  '今日宜：开启 Tab Out 街机粉碎模式；忌：开着 50 个标签假装自己在学习。',
  '今日宜：准时下班享受生活；忌：周末偷偷看工作邮件。'
];

const MERIT_LABELS = ['功德 +1', '内存 +256MB', 'Bug -1', '头发 +1', '薪资 +10%', '单测通过 +1'];

function openCyberWoodfish() {
  const modal = document.getElementById('woodfishBackdrop');
  if (modal) modal.hidden = false;
  updateFortuneText();
}

function closeCyberWoodfish() {
  const modal = document.getElementById('woodfishBackdrop');
  if (modal) modal.hidden = true;
}

function knockWoodfish(e) {
  playAudioEffect('woodfish');
  woodfishKnocks++;

  const countEl = document.getElementById('woodfishCount');
  if (countEl) countEl.textContent = woodfishKnocks;

  const icon = document.getElementById('woodfishIcon');
  if (icon) {
    icon.classList.add('is-knocking');
    setTimeout(() => icon.classList.remove('is-knocking'), 100);
  }

  // Floating merit text
  const stage = document.getElementById('woodfishStage');
  if (stage) {
    const rect = stage.getBoundingClientRect();
    const merit = document.createElement('div');
    merit.className = 'merit-particle';
    merit.textContent = MERIT_LABELS[Math.floor(Math.random() * MERIT_LABELS.length)];
    merit.style.left = `${rect.left + rect.width / 2 - 30 + (Math.random() * 40 - 20)}px`;
    merit.style.top = `${rect.top + 30}px`;
    document.body.appendChild(merit);
    setTimeout(() => merit.remove(), 900);
  }

  if (woodfishKnocks % 3 === 0) {
    updateFortuneText();
  }
}

function updateFortuneText() {
  const el = document.getElementById('fortuneText');
  if (el) {
    el.textContent = GEEK_FORTUNES[Math.floor(Math.random() * GEEK_FORTUNES.length)];
  }
}

/* ================================================================
   3. ARCADE BLAST MODE (街机激光粉碎模式)
   ================================================================ */
let isArcadeMode = false;

function toggleArcadeMode() {
  isArcadeMode = !isArcadeMode;
  document.body.classList.toggle('is-arcade-mode', isArcadeMode);
  const hud = document.getElementById('arcadeHud');
  if (hud) hud.style.display = isArcadeMode ? 'block' : 'none';

  if (isArcadeMode) {
    playAudioEffect('arcade');
    showToast('🕹️ 街机粉碎模式已启动！点击标签发射激光击碎');
  } else {
    showToast('已退出街机粉碎模式');
  }
}

function fireArcadeLaser(targetEl) {
  if (!isArcadeMode || !targetEl) return;

  playAudioEffect('laser');

  const rect = targetEl.getBoundingClientRect();
  const targetX = rect.left + rect.width / 2;
  const targetY = rect.top + rect.height / 2;

  // Laser beam from bottom center to target
  const startX = window.innerWidth / 2;
  const startY = window.innerHeight;
  const dx = targetX - startX;
  const dy = targetY - startY;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;

  const beam = document.createElement('div');
  beam.className = 'laser-beam';
  beam.style.left = `${startX}px`;
  beam.style.top = `${startY}px`;
  beam.style.width = `${length}px`;
  beam.style.height = '4px';
  beam.style.transform = `rotate(${angle}deg)`;
  beam.style.transformOrigin = '0 50%';
  document.body.appendChild(beam);

  setTimeout(() => {
    beam.style.opacity = '0';
    setTimeout(() => beam.remove(), 150);
  }, 100);

  // 8-bit Explosion particle
  const explosion = document.createElement('div');
  explosion.className = 'arcade-explosion';
  explosion.textContent = '💥';
  explosion.style.left = `${targetX}px`;
  explosion.style.top = `${targetY}px`;
  document.body.appendChild(explosion);
  setTimeout(() => explosion.remove(), 400);
}

/**
 * shootConfetti(x, y)
 *
 * Shoots a burst of colorful confetti particles from the given screen
 * coordinates (typically the center of a card being closed).
 * Pure CSS + JS, no libraries.
 */
function shootConfetti(x, y) {
  if (preferences && preferences.confettiEnabled === false) return;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

  const colors = [
    '#f2763d', // tangerine
    '#f4c84a', // sunshine
    '#57966d', // leaf
    '#5d8fd8', // sky
    '#d95d78', // raspberry
    '#4d3a55', // aubergine
    '#fffdf8', // card cream
  ];

  const particleCount = 24;

  for (let i = 0; i < particleCount; i++) {
    const el = document.createElement('div');

    const isCircle = Math.random() > 0.5;
    const size = 5 + Math.random() * 6; // 5–11px
    const color = colors[Math.floor(Math.random() * colors.length)];

    el.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: ${isCircle ? '50%' : '2px'};
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      opacity: 1;
    `;
    document.body.appendChild(el);

    // Physics: random angle and speed for the outward burst
    const angle   = Math.random() * Math.PI * 2;
    const speed   = 60 + Math.random() * 120;
    const vx      = Math.cos(angle) * speed;
    const vy      = Math.sin(angle) * speed - 80; // bias upward
    const gravity = 200;

    const startTime = performance.now();
    const duration  = 700 + Math.random() * 200; // 700–900ms

    function frame(now) {
      const elapsed  = (now - startTime) / 1000;
      const progress = elapsed / (duration / 1000);

      if (progress >= 1) { el.remove(); return; }

      const px = vx * elapsed;
      const py = vy * elapsed + 0.5 * gravity * elapsed * elapsed;
      const opacity = progress < 0.5 ? 1 : 1 - (progress - 0.5) * 2;
      const rotate  = elapsed * 200 * (isCircle ? 0 : 1);

      el.style.transform = `translate(calc(-50% + ${px}px), calc(-50% + ${py}px)) rotate(${rotate}deg)`;
      el.style.opacity = opacity;

      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }
}

/**
 * animateCardOut(card)
 *
 * Smoothly removes a mission card: fade + scale down, then confetti.
 * After the animation, checks if the grid is now empty.
 */
function animateCardOut(card) {
  if (!card) return;

  const rect = card.getBoundingClientRect();
  shootConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);

  card.classList.add('black-hole-collapsing');
  setTimeout(() => {
    card.remove();
    checkAndShowEmptyState();
    updateMascotState();
  }, 420);
}

function showToast(message, options = {}) {
  const toast = document.getElementById('toast');
  const textEl = document.getElementById('toastText');
  const actionBtn = document.getElementById('toastActionBtn');
  if (!toast || !textEl) return;

  if (toastTimeoutId) clearTimeout(toastTimeoutId);

  textEl.textContent = message;

  if (options.actionText && typeof options.onAction === 'function') {
    actionBtn.textContent = options.actionText;
    actionBtn.style.display = 'inline-flex';
    actionBtn.onclick = (e) => {
      e.stopPropagation();
      options.onAction();
    };
  } else if (actionBtn) {
    actionBtn.style.display = 'none';
    actionBtn.onclick = null;
  }

  toast.classList.add('visible');
  toastTimeoutId = setTimeout(() => hideToast(), options.duration || 4500);
}

function hideToast() {
  const toast = document.getElementById('toast');
  if (toast) toast.classList.remove('visible');
  if (toastTimeoutId) clearTimeout(toastTimeoutId);
}

/**
 * checkAndShowEmptyState()
 */
function checkAndShowEmptyState() {
  const missions = document.getElementById('openTabsMissions');
  const section  = document.getElementById('openTabsSection');
  if (!missions || !section) return;

  const remainingCards = missions.querySelectorAll('.mission-card');
  if (remainingCards.length === 0) {
    missions.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">✨</div>
        <div class="empty-title">All clean</div>
        <div class="empty-sub">No tabs to manage right now. Open a link or save this desk as a workspace.</div>
      </div>
    `;
    const countEl = document.getElementById('openTabsSectionCount');
    if (countEl) countEl.textContent = '0';
  }
}

/**
 * timeAgo(dateStr)
 */
function timeAgo(dateStr) {
  if (!dateStr) return '';
  const now = new Date();
  const past = new Date(dateStr);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1)   return t('justNow');
  if (diffMins < 60)  return t('minAgo', { min: diffMins });
  if (diffHours < 24) return t('hrAgo', { hr: diffHours });
  if (diffDays === 1) return t('yesterday');
  return t('daysAgo', { days: diffDays });
}

/**
 * getGreeting()
 */
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 5)  return t('goodNight');
  if (hour < 12) return t('goodMorning');
  if (hour < 17) return t('goodAfternoon');
  if (hour < 22) return t('goodEvening');
  return t('goodNight');
}

/**
 * getDateDisplay()
 */
function getDateDisplay() {
  const lang = getCurrentLanguage();
  const locale = lang === 'zh-CN' ? 'zh-CN' : 'en-US';
  return new Date().toLocaleDateString(locale, {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric',
  });
}

function updateStaticI18n() {
  const lang = getCurrentLanguage();
  const isZh = lang === 'zh-CN';

  const greetingEl = document.getElementById('greeting');
  if (greetingEl) greetingEl.textContent = getGreeting();

  const dateDisplay = document.getElementById('dateDisplay');
  if (dateDisplay) dateDisplay.textContent = getDateDisplay();

  const clockLabel = document.querySelector('.clock-card span');
  if (clockLabel) clockLabel.textContent = t('localTime');

  const weatherTemp = document.getElementById('weatherTemperature');
  if (weatherTemp && (!preferences || !preferences.city)) {
    weatherTemp.textContent = t('addWeather');
  }

  const weatherLoc = document.getElementById('weatherLocation');
  if (weatherLoc && (!preferences || !preferences.city)) {
    weatherLoc.textContent = t('chooseCity');
  }

  const searchBtn = document.querySelector('.command-btn span');
  if (searchBtn) searchBtn.textContent = t('findAnything');

  const commandInput = document.getElementById('commandInput');
  if (commandInput) {
    commandInput.placeholder = t('searchPlaceholder');
    commandInput.setAttribute('aria-label', t('searchPlaceholder'));
  }

  const workspaceTitle = document.getElementById('workspaceTitle');
  if (workspaceTitle) workspaceTitle.textContent = t('workspaces');

  const workspaceKicker = document.querySelector('.workspace-kicker');
  if (workspaceKicker) workspaceKicker.textContent = t('savedSetups');

  const workspaceCreateBtn = document.querySelector('.workspace-create-btn');
  if (workspaceCreateBtn) workspaceCreateBtn.innerHTML = `<span aria-hidden="true">＋</span> ${t('saveThisDesk')}`;

  const openTabsTitle = document.getElementById('openTabsSectionTitle');
  if (openTabsTitle) openTabsTitle.textContent = t('rightNow');

  const deferredHeader = document.querySelector('#deferredColumn .section-header h2');
  if (deferredHeader) deferredHeader.textContent = t('savedForLater');

  const deferredEmpty = document.getElementById('deferredEmpty');
  if (deferredEmpty) deferredEmpty.textContent = t('nothingSaved');

  const personalizeTitle = document.getElementById('personalizeTitle');
  if (personalizeTitle) personalizeTitle.textContent = isZh ? '个性化你的桌面' : 'Personalize your desk';

  const personalizeKicker = document.querySelector('.personalize-kicker');
  if (personalizeKicker) personalizeKicker.textContent = isZh ? '定制专属风格' : 'Make it yours';

  const lblSettingLanguage = document.getElementById('lblSettingLanguage');
  if (lblSettingLanguage) lblSettingLanguage.textContent = isZh ? '界面语言' : 'Language / 界面语言';

  const lblWeatherCity = document.getElementById('lblWeatherCity');
  if (lblWeatherCity) lblWeatherCity.textContent = isZh ? '天气城市' : 'Weather city';

  const hintWeatherCity = document.getElementById('hintWeatherCity');
  if (hintWeatherCity) hintWeatherCity.textContent = isZh ? '选填。仅在查询天气时发送至 Open-Meteo。' : 'Optional. Your city is sent to Open-Meteo only to fetch weather.';

  const lblDeskBackground = document.getElementById('lblDeskBackground');
  if (lblDeskBackground) lblDeskBackground.textContent = isZh ? '桌面背景' : 'Desk background';

  const headerSearchText = document.getElementById('headerSearchText');
  if (headerSearchText) headerSearchText.textContent = t('findAnything');

  const quickDiscardText = document.getElementById('quickDiscardText');
  if (quickDiscardText) quickDiscardText.textContent = isZh ? '释放内存' : 'Free RAM';

  const swatchPaperText = document.getElementById('swatchPaperText');
  if (swatchPaperText) swatchPaperText.textContent = isZh ? '复古纸' : 'Paper';
  const swatchDarkText = document.getElementById('swatchDarkText');
  if (swatchDarkText) swatchDarkText.textContent = isZh ? '极夜深黑' : 'Dark';
  const swatchSpaceText = document.getElementById('swatchSpaceText');
  if (swatchSpaceText) swatchSpaceText.textContent = isZh ? '深空冷灰' : 'Space';
  const swatchSunriseText = document.getElementById('swatchSunriseText');
  if (swatchSunriseText) swatchSunriseText.textContent = isZh ? '日出' : 'Sunrise';
  const swatchSkyText = document.getElementById('swatchSkyText');
  if (swatchSkyText) swatchSkyText.textContent = isZh ? '晴空' : 'Sky';
  const swatchGardenText = document.getElementById('swatchGardenText');
  if (swatchGardenText) swatchGardenText.textContent = isZh ? '庭院' : 'Garden';

  const lblCustomPicture = document.getElementById('lblCustomPicture');
  if (lblCustomPicture) lblCustomPicture.textContent = isZh ? '自定义壁纸' : 'Your own picture';

  const btnRemoveImage = document.getElementById('btnRemoveImage');
  if (btnRemoveImage) btnRemoveImage.textContent = isZh ? '移除壁纸' : 'Remove image';

  const lblSoundMotion = document.getElementById('lblSoundMotion');
  if (lblSoundMotion) lblSoundMotion.textContent = isZh ? '声音与动效' : 'Sound & Motion';

  const lblSoundTitle = document.getElementById('lblSoundTitle');
  if (lblSoundTitle) lblSoundTitle.textContent = isZh ? 'Swoosh 交互音效' : 'Swoosh sound effect';

  const lblSoundDesc = document.getElementById('lblSoundDesc');
  if (lblSoundDesc) lblSoundDesc.textContent = isZh ? '关闭标签时播放清脆微音效' : 'Play audio feedback when closing tabs';

  const lblConfettiTitle = document.getElementById('lblConfettiTitle');
  if (lblConfettiTitle) lblConfettiTitle.textContent = isZh ? '彩带动效粒子' : 'Confetti burst';

  const lblConfettiDesc = document.getElementById('lblConfettiDesc');
  if (lblConfettiDesc) lblConfettiDesc.textContent = isZh ? '关闭标签或卡片时发射庆祝粒子' : 'Show celebration particles on tab cleanup';

  const lblTabOptimization = document.getElementById('lblTabOptimization');
  if (lblTabOptimization) lblTabOptimization.textContent = isZh ? '标签优化' : 'Tab optimization';

  const btnDiscardTabsText = document.getElementById('btnDiscardTabsText');
  if (btnDiscardTabsText) btnDiscardTabsText.textContent = isZh ? '释放内存 (休眠后台标签)' : 'Free up memory (Freeze inactive tabs)';

  const hintDiscardTabs = document.getElementById('hintDiscardTabs');
  if (hintDiscardTabs) hintDiscardTabs.textContent = isZh ? '休眠后台非活跃标签以释放 RAM 内存，不关闭页面。' : 'Suspends background tabs without closing them to save RAM.';

  const lblDataBackup = document.getElementById('lblDataBackup');
  if (lblDataBackup) lblDataBackup.textContent = isZh ? '数据备份与恢复' : 'Data & Backup';

  const btnExportDataText = document.getElementById('btnExportDataText');
  if (btnExportDataText) btnExportDataText.textContent = isZh ? '导出 JSON' : 'Export JSON';

  const btnImportDataText = document.getElementById('btnImportDataText');
  if (btnImportDataText) btnImportDataText.textContent = isZh ? '导入 JSON' : 'Import JSON';

  const hintBackupData = document.getElementById('hintBackupData');
  if (hintBackupData) hintBackupData.textContent = isZh ? '备份工作区与待办清单，方便跨设备迁移或防丢。' : 'Back up your workspaces and saved links to transfer across browsers.';

  const btnCancelPersonalize = document.getElementById('btnCancelPersonalize');
  if (btnCancelPersonalize) btnCancelPersonalize.textContent = isZh ? '取消' : 'Cancel';

  const btnSavePersonalize = document.getElementById('btnSavePersonalize');
  if (btnSavePersonalize) btnSavePersonalize.textContent = isZh ? '保存设置' : 'Save changes';
}


/* ----------------------------------------------------------------
   DAILY DESK — Clock, Weather, and Personalization
   ---------------------------------------------------------------- */

const PREFERENCES_KEY   = 'tabOutPreferences';
const WEATHER_CACHE_KEY = 'tabOutWeatherCache';
const DEFAULT_PREFERENCES = {
  city: '',
  background: 'paper',
  backgroundImage: '',
  language: 'auto',
  soundEnabled: true,
  soundPack: 'swoosh',
  confettiEnabled: true,
  mascotEnabled: true,
  mascotType: 'cat',
  catColor: 'orange',
};

let preferences = { ...DEFAULT_PREFERENCES };
let pendingPreferences = null;
let personalizationTrigger = null;

function updateClock() {
  const clockEl = document.getElementById('clockTime');
  const dateEl = document.getElementById('dateDisplay');
  if (clockEl) {
    clockEl.textContent = new Intl.DateTimeFormat(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date());
  }
  if (dateEl) dateEl.textContent = getDateDisplay();
}

function applyBackground(nextPreferences) {
  const background = nextPreferences.background || 'paper';
  document.body.dataset.background = background;

  const image = nextPreferences.backgroundImage || '';
  document.body.classList.toggle('has-custom-background', Boolean(image));
  if (image) {
    document.body.style.setProperty('--custom-background-image', `url(${JSON.stringify(image)})`);
  } else {
    document.body.style.removeProperty('--custom-background-image');
  }
}

function syncBackgroundButtons(background) {
  document.querySelectorAll('[data-action="preview-background"]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.background === background));
  });
}

async function loadPreferences() {
  try {
    const stored = await chrome.storage.local.get(PREFERENCES_KEY);
    preferences = {
      ...DEFAULT_PREFERENCES,
      ...(stored[PREFERENCES_KEY] || {}),
    };
  } catch {
    preferences = { ...DEFAULT_PREFERENCES };
  }

  applyBackground(preferences);
  updateStaticI18n();
  updateMascotState();
  await refreshWeather();
}

function openPersonalization() {
  const backdrop = document.getElementById('personalizeBackdrop');
  const cityInput = document.getElementById('weatherCity');
  if (!backdrop || !cityInput) return;

  pendingPreferences = { ...preferences };
  personalizationTrigger = document.activeElement;
  cityInput.value = pendingPreferences.city || '';

  const langSelect = document.getElementById('settingLanguage');
  if (langSelect) langSelect.value = pendingPreferences.language || 'auto';

  const soundCheckbox = document.getElementById('settingSound');
  if (soundCheckbox) soundCheckbox.checked = pendingPreferences.soundEnabled !== false;

  const soundPackSelect = document.getElementById('settingSoundPack');
  if (soundPackSelect) soundPackSelect.value = pendingPreferences.soundPack || 'swoosh';

  const confettiCheckbox = document.getElementById('settingConfetti');
  if (confettiCheckbox) confettiCheckbox.checked = pendingPreferences.confettiEnabled !== false;

  const mascotCheckbox = document.getElementById('settingMascot');
  if (mascotCheckbox) mascotCheckbox.checked = pendingPreferences.mascotEnabled !== false;

  const catColorSelect = document.getElementById('settingCatColor');
  if (catColorSelect) catColorSelect.value = pendingPreferences.catColor || 'orange';

  syncBackgroundButtons(pendingPreferences.background);
  updateBackgroundStatus();
  backdrop.hidden = false;
  document.querySelector('.container')?.setAttribute('inert', '');
  document.body.style.overflow = 'hidden';
  setTimeout(() => cityInput.focus(), 50);
}

function closePersonalization(restorePreview = true) {
  const backdrop = document.getElementById('personalizeBackdrop');
  if (!backdrop || backdrop.hidden) return;
  backdrop.hidden = true;
  document.querySelector('.container')?.removeAttribute('inert');
  document.body.style.overflow = '';
  if (restorePreview) applyBackground(preferences);
  pendingPreferences = null;
  if (personalizationTrigger instanceof HTMLElement) personalizationTrigger.focus();
  personalizationTrigger = null;
}

function previewBackground(background) {
  if (!pendingPreferences) return;
  pendingPreferences.background = background;
  pendingPreferences.backgroundImage = '';
  applyBackground(pendingPreferences);
  syncBackgroundButtons(background);
  updateBackgroundStatus(`Previewing the ${background} background.`);
}

function updateBackgroundStatus(message = '') {
  const status = document.getElementById('backgroundStatus');
  if (!status) return;
  if (message) {
    status.textContent = message;
  } else if (pendingPreferences && pendingPreferences.backgroundImage) {
    status.textContent = 'Custom image ready. It stays only in this browser.';
  } else {
    status.textContent = 'Images are resized and stored only in this browser.';
  }
}

function compressBackgroundImage(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Choose an image file'));
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      reject(new Error('Image must be smaller than 12 MB'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read that image'));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error('Could not decode that image'));
      image.onload = () => {
        const maxDimension = 1920;
        const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));

        const context = canvas.getContext('2d');
        context.fillStyle = '#f7f1e7';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        if (dataUrl.length > 6 * 1024 * 1024) {
          reject(new Error('That image is still too large after resizing'));
          return;
        }
        resolve(dataUrl);
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function getWeatherPresentation(code, isDay = true) {
  if (code === 0) return { icon: isDay ? '☀️' : '🌙', label: 'Clear' };
  if (code <= 3) return { icon: code === 1 ? '🌤️' : '☁️', label: 'Cloudy' };
  if (code === 45 || code === 48) return { icon: '🌫️', label: 'Foggy' };
  if (code >= 51 && code <= 67) return { icon: '🌧️', label: 'Rain' };
  if (code >= 71 && code <= 77) return { icon: '❄️', label: 'Snow' };
  if (code >= 80 && code <= 82) return { icon: '🌦️', label: 'Showers' };
  if (code >= 85 && code <= 86) return { icon: '🌨️', label: 'Snow showers' };
  if (code >= 95) return { icon: '⛈️', label: 'Thunder' };
  return { icon: '🌡️', label: 'Weather' };
}

function renderWeather(data) {
  const card = document.getElementById('weatherCard');
  const icon = document.getElementById('weatherIcon');
  const temperature = document.getElementById('weatherTemperature');
  const location = document.getElementById('weatherLocation');
  if (!card || !icon || !temperature || !location) return;

  card.classList.remove('is-loading');

  if (!data) {
    icon.textContent = '☀️';
    temperature.textContent = 'Add weather';
    location.textContent = 'Choose a city';
    card.setAttribute('aria-label', 'Set up weather');
    return;
  }

  if (data.error) {
    icon.textContent = '🌥️';
    temperature.textContent = 'Weather unavailable';
    location.textContent = data.error;
    card.setAttribute('aria-label', 'Weather unavailable. Open settings');
    return;
  }

  const presentation = getWeatherPresentation(data.code, data.isDay);
  icon.textContent = presentation.icon;
  temperature.textContent = `${Math.round(data.temperature)}° · ${presentation.label}`;
  location.textContent = data.country ? `${data.city}, ${data.country}` : data.city;
  card.setAttribute('aria-label', `${temperature.textContent} in ${location.textContent}. Open settings`);
}

async function refreshWeather(force = false) {
  const city = preferences.city.trim();
  if (!city) {
    renderWeather(null);
    return;
  }

  const card = document.getElementById('weatherCard');
  const temperature = document.getElementById('weatherTemperature');
  const location = document.getElementById('weatherLocation');
  if (card) card.classList.add('is-loading');
  if (temperature) temperature.textContent = 'Looking outside…';
  if (location) location.textContent = city;

  try {
    const stored = await chrome.storage.local.get(WEATHER_CACHE_KEY);
    const cached = stored[WEATHER_CACHE_KEY];
    const cacheIsFresh = cached
      && cached.query === city.toLowerCase()
      && Date.now() - cached.fetchedAt < 30 * 60 * 1000;

    if (!force && cacheIsFresh) {
      renderWeather(cached);
      return;
    }

    const geocodeUrl = new URL('https://geocoding-api.open-meteo.com/v1/search');
    geocodeUrl.search = new URLSearchParams({
      name: city,
      count: '1',
      language: 'en',
      format: 'json',
    });
    const geocodeResponse = await fetch(geocodeUrl);
    if (!geocodeResponse.ok) throw new Error('City lookup failed');
    const geocode = await geocodeResponse.json();
    const place = geocode.results && geocode.results[0];
    if (!place) throw new Error('City not found');

    const forecastUrl = new URL('https://api.open-meteo.com/v1/forecast');
    forecastUrl.search = new URLSearchParams({
      latitude: String(place.latitude),
      longitude: String(place.longitude),
      current: 'temperature_2m,weather_code,is_day',
      temperature_unit: 'celsius',
      timezone: 'auto',
    });
    const forecastResponse = await fetch(forecastUrl);
    if (!forecastResponse.ok) throw new Error('Weather request failed');
    const forecast = await forecastResponse.json();

    const temperature = Number(forecast.current && forecast.current.temperature_2m);
    const weatherCode = Number(forecast.current && forecast.current.weather_code);
    if (!Number.isFinite(temperature) || !Number.isFinite(weatherCode)) {
      throw new Error('Weather data unavailable');
    }

    const weather = {
      query: city.toLowerCase(),
      city: place.name,
      country: place.country_code || '',
      temperature,
      code: weatherCode,
      isDay: forecast.current.is_day === 1,
      fetchedAt: Date.now(),
    };

    await chrome.storage.local.set({ [WEATHER_CACHE_KEY]: weather });
    renderWeather(weather);
  } catch (error) {
    console.warn('[tab-out] Weather update failed:', error);
    renderWeather({ error: error.message || 'Try again later' });
  }
}


/* ----------------------------------------------------------------
   DOMAIN & TITLE CLEANUP HELPERS
   ---------------------------------------------------------------- */

// Map of known hostnames → friendly display names.
const FRIENDLY_DOMAINS = {
  'github.com':           'GitHub',
  'www.github.com':       'GitHub',
  'gist.github.com':      'GitHub Gist',
  'youtube.com':          'YouTube',
  'www.youtube.com':      'YouTube',
  'music.youtube.com':    'YouTube Music',
  'x.com':                'X',
  'www.x.com':            'X',
  'twitter.com':          'X',
  'www.twitter.com':      'X',
  'reddit.com':           'Reddit',
  'www.reddit.com':       'Reddit',
  'old.reddit.com':       'Reddit',
  'substack.com':         'Substack',
  'www.substack.com':     'Substack',
  'medium.com':           'Medium',
  'www.medium.com':       'Medium',
  'linkedin.com':         'LinkedIn',
  'www.linkedin.com':     'LinkedIn',
  'stackoverflow.com':    'Stack Overflow',
  'www.stackoverflow.com':'Stack Overflow',
  'news.ycombinator.com': 'Hacker News',
  'google.com':           'Google',
  'www.google.com':       'Google',
  'mail.google.com':      'Gmail',
  'docs.google.com':      'Google Docs',
  'drive.google.com':     'Google Drive',
  'calendar.google.com':  'Google Calendar',
  'meet.google.com':      'Google Meet',
  'gemini.google.com':    'Gemini',
  'chatgpt.com':          'ChatGPT',
  'www.chatgpt.com':      'ChatGPT',
  'chat.openai.com':      'ChatGPT',
  'claude.ai':            'Claude',
  'www.claude.ai':        'Claude',
  'code.claude.com':      'Claude Code',
  'notion.so':            'Notion',
  'www.notion.so':        'Notion',
  'figma.com':            'Figma',
  'www.figma.com':        'Figma',
  'slack.com':            'Slack',
  'app.slack.com':        'Slack',
  'discord.com':          'Discord',
  'www.discord.com':      'Discord',
  'wikipedia.org':        'Wikipedia',
  'en.wikipedia.org':     'Wikipedia',
  'amazon.com':           'Amazon',
  'www.amazon.com':       'Amazon',
  'netflix.com':          'Netflix',
  'www.netflix.com':      'Netflix',
  'spotify.com':          'Spotify',
  'open.spotify.com':     'Spotify',
  'vercel.com':           'Vercel',
  'www.vercel.com':       'Vercel',
  'npmjs.com':            'npm',
  'www.npmjs.com':        'npm',
  'developer.mozilla.org':'MDN',
  'arxiv.org':            'arXiv',
  'www.arxiv.org':        'arXiv',
  'huggingface.co':       'Hugging Face',
  'www.huggingface.co':   'Hugging Face',
  'producthunt.com':      'Product Hunt',
  'www.producthunt.com':  'Product Hunt',
  'xiaohongshu.com':      'RedNote',
  'www.xiaohongshu.com':  'RedNote',
  'local-files':          'Local Files',
};

function friendlyDomain(hostname) {
  if (!hostname) return '';
  if (FRIENDLY_DOMAINS[hostname]) return FRIENDLY_DOMAINS[hostname];

  if (hostname.endsWith('.substack.com') && hostname !== 'substack.com') {
    return capitalize(hostname.replace('.substack.com', '')) + "'s Substack";
  }
  if (hostname.endsWith('.github.io')) {
    return capitalize(hostname.replace('.github.io', '')) + ' (GitHub Pages)';
  }

  let clean = hostname
    .replace(/^www\./, '')
    .replace(/\.(com|org|net|io|co|ai|dev|app|so|me|xyz|info|us|uk|co\.uk|co\.jp)$/, '');

  return clean.split('.').map(part => capitalize(part)).join(' ');
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function stripTitleNoise(title) {
  if (!title) return '';
  // Strip leading notification count: "(2) Title"
  title = title.replace(/^\(\d+\+?\)\s*/, '');
  // Strip inline counts like "Inbox (16,359)"
  title = title.replace(/\s*\([\d,]+\+?\)\s*/g, ' ');
  // Strip email addresses (privacy + cleaner display)
  title = title.replace(/\s*[\-\u2010-\u2015]\s*[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g, '');
  title = title.replace(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g, '');
  // Clean X/Twitter format
  title = title.replace(/\s+on X:\s*/, ': ');
  title = title.replace(/\s*\/\s*X\s*$/, '');
  return title.trim();
}

function cleanTitle(title, hostname) {
  if (!title || !hostname) return title || '';

  const friendly = friendlyDomain(hostname);
  const domain   = hostname.replace(/^www\./, '');
  const seps     = [' - ', ' | ', ' — ', ' · ', ' – '];

  for (const sep of seps) {
    const idx = title.lastIndexOf(sep);
    if (idx === -1) continue;
    const suffix     = title.slice(idx + sep.length).trim();
    const suffixLow  = suffix.toLowerCase();
    if (
      suffixLow === domain.toLowerCase() ||
      suffixLow === friendly.toLowerCase() ||
      suffixLow === domain.replace(/\.\w+$/, '').toLowerCase() ||
      domain.toLowerCase().includes(suffixLow) ||
      friendly.toLowerCase().includes(suffixLow)
    ) {
      const cleaned = title.slice(0, idx).trim();
      if (cleaned.length >= 5) return cleaned;
    }
  }
  return title;
}

function smartTitle(title, url) {
  if (!url) return title || '';
  let pathname = '', hostname = '';
  try { const u = new URL(url); pathname = u.pathname; hostname = u.hostname; }
  catch { return title || ''; }

  const titleIsUrl = !title || title === url || title.startsWith(hostname) || title.startsWith('http');

  if ((hostname === 'x.com' || hostname === 'twitter.com' || hostname === 'www.x.com') && pathname.includes('/status/')) {
    const username = pathname.split('/')[1];
    if (username) return titleIsUrl ? `Post by @${username}` : title;
  }

  if (hostname === 'github.com' || hostname === 'www.github.com') {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length >= 2) {
      const [owner, repo, ...rest] = parts;
      if (rest[0] === 'issues' && rest[1]) return `${owner}/${repo} Issue #${rest[1]}`;
      if (rest[0] === 'pull'   && rest[1]) return `${owner}/${repo} PR #${rest[1]}`;
      if (rest[0] === 'blob' || rest[0] === 'tree') return `${owner}/${repo} — ${rest.slice(2).join('/')}`;
      if (titleIsUrl) return `${owner}/${repo}`;
    }
  }

  if ((hostname === 'www.youtube.com' || hostname === 'youtube.com') && pathname === '/watch') {
    if (titleIsUrl) return 'YouTube Video';
  }

  if ((hostname === 'www.reddit.com' || hostname === 'reddit.com' || hostname === 'old.reddit.com') && pathname.includes('/comments/')) {
    const parts  = pathname.split('/').filter(Boolean);
    const subIdx = parts.indexOf('r');
    if (subIdx !== -1 && parts[subIdx + 1]) {
      if (titleIsUrl) return `r/${parts[subIdx + 1]} post`;
    }
  }

  return title || url;
}


/* ----------------------------------------------------------------
   SVG ICON STRINGS
   ---------------------------------------------------------------- */
const ICONS = {
  tabs:    `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8.25V18a2.25 2.25 0 0 0 2.25 2.25h13.5A2.25 2.25 0 0 0 21 18V8.25m-18 0V6a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 6v2.25m-18 0h18" /></svg>`,
  close:   `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>`,
  archive: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>`,
  focus:   `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" /></svg>`,
};


/* ----------------------------------------------------------------
   IN-MEMORY STORE FOR OPEN-TAB GROUPS
   ---------------------------------------------------------------- */
let domainGroups = [];


/* ----------------------------------------------------------------
   HELPER: filter out browser-internal pages
   ---------------------------------------------------------------- */

/**
 * getRealTabs()
 *
 * Returns tabs that are real web pages — no chrome://, extension
 * pages, about:blank, etc.
 */
function getRealTabs() {
  return openTabs.filter(t => {
    const url = t.url || '';
    return (
      !url.startsWith('chrome://') &&
      !url.startsWith('chrome-extension://') &&
      !url.startsWith('about:') &&
      !url.startsWith('edge://') &&
      !url.startsWith('brave://')
    );
  });
}

/**
 * checkTabOutDupes()
 *
 * Counts how many Tab Out pages are open. If more than 1,
 * shows a banner offering to close the extras.
 */
function checkTabOutDupes() {
  const tabOutTabs = openTabs.filter(t => t.isTabOut);
  const banner  = document.getElementById('tabOutDupeBanner');
  const countEl = document.getElementById('tabOutDupeCount');
  if (!banner) return;

  if (tabOutTabs.length > 1) {
    if (countEl) countEl.textContent = tabOutTabs.length;
    banner.style.display = 'flex';
  } else {
    banner.style.display = 'none';
  }
}


/* ----------------------------------------------------------------
   OVERFLOW CHIPS ("+N more" expand button in domain cards)
   ---------------------------------------------------------------- */

function getLocalFaviconUrl(pageUrl, size = 16) {
  if (!pageUrl) return '';
  try {
    const faviconUrl = new URL(chrome.runtime.getURL('/_favicon/'));
    faviconUrl.searchParams.set('pageUrl', pageUrl);
    faviconUrl.searchParams.set('size', String(size));
    return faviconUrl.toString();
  } catch {
    return '';
  }
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function faviconInitial(label, pageUrl) {
  let source = String(label || '').trim();
  if (!source) {
    try { source = new URL(pageUrl).hostname.replace(/^www\./, ''); }
    catch { source = '?'; }
  }
  const first = Array.from(source)[0] || '?';
  return first.toUpperCase();
}

function faviconTone(pageUrl) {
  let hash = 0;
  for (const char of String(pageUrl || '')) hash = ((hash << 5) - hash + char.charCodeAt(0)) | 0;
  return Math.abs(hash % 6) + 1;
}

function hasRealFavicon(favIconUrl) {
  const value = String(favIconUrl || '');
  return Boolean(value) && !value.startsWith('chrome://') && !value.includes('IDR_DEFAULT_FAVICON');
}

function faviconMarkup(pageUrl, label, extraClass = '', faviconAvailable = false) {
  const faviconUrl = faviconAvailable ? getLocalFaviconUrl(pageUrl) : '';
  const shellClass = `favicon-shell favicon-tone-${faviconTone(pageUrl)}${extraClass ? ` ${extraClass}` : ''}`;
  return `<span class="${shellClass}${faviconUrl ? '' : ' is-missing'}" aria-hidden="true">
    <span class="favicon-fallback">${escapeHtml(faviconInitial(label, pageUrl))}</span>
    ${faviconUrl ? `<img class="chip-favicon favicon-image" src="${escapeHtml(faviconUrl)}" alt="">` : ''}
  </span>`;
}

document.addEventListener('error', (event) => {
  const image = event.target;
  if (!(image instanceof HTMLImageElement) || !image.classList.contains('favicon-image')) return;
  image.closest('.favicon-shell')?.classList.add('is-missing');
}, true);

document.addEventListener('load', (event) => {
  const image = event.target;
  if (!(image instanceof HTMLImageElement) || !image.classList.contains('favicon-image')) return;
  image.closest('.favicon-shell')?.classList.remove('is-missing');
}, true);


/* ----------------------------------------------------------------
   COMMAND PALETTE — open tabs, saved links, and workspaces
   ---------------------------------------------------------------- */

function commandSubtitle(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); }
  catch { return url || ''; }
}

async function buildCommandItems() {
  const [saved] = await Promise.all([
    getSavedTabs(),
    fetchOpenTabs(),
    loadWorkspaces(),
  ]);
  const { active, archived } = saved;

  const actionItems = [
    {
      type: 'action',
      actionId: 'discard-inactive',
      title: t('actionDiscardCmd'),
      subtitle: t('freezeInactive'),
      searchText: 'freeze discard memory ram 释放内存 内存 休眠'.toLowerCase(),
    },
    {
      type: 'action',
      actionId: 'export-backup',
      title: t('actionExportCmd'),
      subtitle: 'JSON Backup',
      searchText: 'export backup json 备份 导出 导出备份'.toLowerCase(),
    },
    {
      type: 'action',
      actionId: 'dedup-all',
      title: t('actionDedupCmd'),
      subtitle: t('closeDupes', { count: '' }),
      searchText: 'dedup duplicate duplicates 重复 清理重复'.toLowerCase(),
    }
  ];

  const tabItems = getRealTabs().map(tab => ({
    type: 'tab',
    title: tab.title || tab.url,
    subtitle: commandSubtitle(tab.url),
    url: tab.url,
    tabId: tab.id,
    windowId: tab.windowId,
    hasFavicon: hasRealFavicon(tab.favIconUrl),
    searchText: `${tab.title || ''} ${tab.url || ''}`.toLowerCase(),
  }));
  const savedItems = [...active, ...archived].map(item => ({
    type: 'saved',
    title: item.title || item.url,
    subtitle: `${commandSubtitle(item.url)} · ${t('savedForLater')}`,
    url: item.url,
    hasFavicon: false,
    searchText: `${item.title || ''} ${item.url || ''}`.toLowerCase(),
  }));
  const workspaceItems = workspaces.map(workspace => ({
    type: 'workspace',
    title: workspace.name,
    subtitle: `${workspace.tabs?.length || 0} tabs · ${t('workspaces')}`,
    workspaceId: workspace.id,
    searchText: `${workspace.name || ''} ${(workspace.tabs || []).map(tab => `${tab.title} ${tab.url}`).join(' ')}`.toLowerCase(),
  }));

  commandItems = [...actionItems, ...workspaceItems, ...tabItems, ...savedItems];
  return commandItems;
}

function getCommandMatches(query) {
  const normalized = String(query || '').trim().toLowerCase();
  const tokens = normalized.split(/\s+/).filter(Boolean);
  const typeOrder = { action: 0, workspace: 1, tab: 2, saved: 3 };

  return commandItems
    .map((item, originalIndex) => {
      if (tokens.some(token => !item.searchText.includes(token))) return null;
      let score = normalized ? 10 : 0;
      const title = String(item.title || '').toLowerCase();
      if (normalized && title === normalized) score += 100;
      else if (normalized && title.startsWith(normalized)) score += 50;
      else if (normalized && title.includes(normalized)) score += 25;
      if (normalized && String(item.url || '').toLowerCase().includes(normalized)) score += 15;
      score -= typeOrder[item.type] || 0;
      return { ...item, score, originalIndex };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.originalIndex - b.originalIndex)
    .slice(0, 12);
}

function renderCommandResults() {
  const input = document.getElementById('commandInput');
  const results = document.getElementById('commandResults');
  if (!input || !results) return;

  const matches = getCommandMatches(input.value);
  commandSelection = Math.max(0, Math.min(commandSelection, matches.length - 1));
  results.dataset.matchCount = String(matches.length);

  if (matches.length === 0) {
    results.innerHTML = '<div class="command-empty">No match. Try a title, website, or workspace name.</div>';
    input.removeAttribute('aria-activedescendant');
    return;
  }

  results.innerHTML = matches.map((item, index) => {
    const selected = index === commandSelection;
    let icon = '';
    if (item.type === 'action') {
      icon = '<span class="command-workspace-icon" aria-hidden="true">⚡</span>';
    } else if (item.type === 'workspace') {
      icon = '<span class="command-workspace-icon" aria-hidden="true">✦</span>';
    } else {
      icon = faviconMarkup(item.url, item.title, 'favicon-shell-command', item.hasFavicon);
    }
    return `<button class="command-result${selected ? ' is-selected' : ''}" id="command-result-${index}" type="button" role="option" tabindex="-1" aria-selected="${selected}" data-action="run-command" data-command-index="${index}">
      ${icon}
      <span class="command-result-copy">
        <strong>${escapeHtml(item.title)}</strong>
        <span>${escapeHtml(item.subtitle)}</span>
      </span>
      <span class="command-kind">${escapeHtml(item.type)}</span>
    </button>`;
  }).join('');
  input.setAttribute('aria-activedescendant', `command-result-${commandSelection}`);
}

async function openCommandPalette(trigger) {
  const backdrop = document.getElementById('commandBackdrop');
  const input = document.getElementById('commandInput');
  if (!backdrop || !input) return;

  commandTrigger = trigger || document.activeElement;
  commandInertElements = [
    document.querySelector('.container'),
    document.getElementById('personalizeBackdrop'),
  ].filter(element => element && !element.inert);
  commandInertElements.forEach(element => { element.inert = true; });
  backdrop.hidden = false;
  document.body.classList.add('command-open');
  input.setAttribute('aria-expanded', 'true');
  input.value = '';
  commandSelection = 0;
  commandItems = [];
  const results = document.getElementById('commandResults');
  if (results) results.innerHTML = '<div class="command-empty">Looking through your desk…</div>';
  input.focus();

  try {
    await buildCommandItems();
    renderCommandResults();
  } catch (error) {
    console.warn('[tab-out] Could not build command palette:', error);
    commandItems = [];
    renderCommandResults();
  }
}

function closeCommandPalette(restoreFocus = true) {
  const backdrop = document.getElementById('commandBackdrop');
  if (!backdrop || backdrop.hidden) return;
  backdrop.hidden = true;
  document.body.classList.remove('command-open');
  commandInertElements.forEach(element => { element.inert = false; });
  commandInertElements = [];
  document.getElementById('commandInput')?.setAttribute('aria-expanded', 'false');
  if (restoreFocus && typeof commandTrigger?.focus === 'function') commandTrigger.focus();
  commandTrigger = null;
}

async function executeCommand(index) {
  const input = document.getElementById('commandInput');
  const matches = getCommandMatches(input?.value || '');
  const item = matches[index];
  if (!item) return;
  closeCommandPalette(true);

  if (item.type === 'action') {
    if (item.actionId === 'discard-inactive') {
      await discardInactiveTabs();
    } else if (item.actionId === 'export-backup') {
      await exportUserData();
    } else if (item.actionId === 'dedup-all') {
      await closeDuplicateTabs([], true);
      showToast(t('closeDupes', { count: '' }));
      await renderDashboard();
    }
    return;
  }

  if (item.type === 'workspace') {
    const result = await restoreWorkspace(item.workspaceId);
    showToast(workspaceRestoreMessage(result));
    await renderDashboard();
    return;
  }

  if (item.type === 'tab' && Number.isInteger(item.tabId)) {
    await focusTabById(item.tabId, item.windowId, item.url);
    return;
  }

  const tabs = await chrome.tabs.query({});
  if (tabs.some(tab => tab.url === item.url)) await focusTab(item.url);
  else await chrome.tabs.create({ url: item.url, active: true });
}

function buildOverflowChips(hiddenTabs, urlCounts = {}) {
  const hiddenChips = hiddenTabs.map(tab => {
    const label    = cleanTitle(smartTitle(stripTitleNoise(tab.title || ''), tab.url), '');
    const count    = urlCounts[tab.url] || 1;
    const dupeTag  = count > 1 ? ` <span class="chip-dupe-badge">(${count}x)</span>` : '';
    const chipClass = count > 1 ? ' chip-has-dupes' : '';
    const safeUrl   = escapeHtml(tab.url || '');
    const safeTitle = escapeHtml(label);
    return `<div class="page-chip clickable${chipClass}" data-action="focus-tab" data-tab-url="${safeUrl}" title="${safeTitle}">
      ${faviconMarkup(tab.url, label, '', hasRealFavicon(tab.favIconUrl))}
      <span class="chip-text">${escapeHtml(label)}</span>${dupeTag}
      <div class="chip-actions">
        <button class="chip-action chip-save" data-action="defer-single-tab" data-tab-url="${safeUrl}" data-tab-title="${safeTitle}" title="Save for later">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" /></svg>
        </button>
        <button class="chip-action chip-close" data-action="close-single-tab" data-tab-url="${safeUrl}" title="Close this tab">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>`;
  }).join('');

  return `
    <div class="page-chips-overflow" style="display:none">${hiddenChips}</div>
    <div class="page-chip page-chip-overflow clickable" data-action="expand-chips">
      <span class="chip-text">+${hiddenTabs.length} more</span>
    </div>`;
}


/* ----------------------------------------------------------------
   DOMAIN CARD RENDERER
   ---------------------------------------------------------------- */

/**
 * renderDomainCard(group, groupIndex)
 *
 * Builds the HTML for one domain group card.
 * group = { domain: string, tabs: [{ url, title, id, windowId, active }] }
 */
function renderDomainCard(group) {
  const tabs      = group.tabs || [];
  const tabCount  = tabs.length;
  const isLanding = group.domain === '__landing-pages__';
  const stableId  = 'domain-' + group.domain.replace(/[^a-z0-9]/g, '-');

  // Count duplicates (exact URL match)
  const urlCounts = {};
  for (const tab of tabs) urlCounts[tab.url] = (urlCounts[tab.url] || 0) + 1;
  const dupeUrls   = Object.entries(urlCounts).filter(([, c]) => c > 1);
  const hasDupes   = dupeUrls.length > 0;
  const totalExtras = dupeUrls.reduce((s, [, c]) => s + c - 1, 0);

  const tabBadge = `<span class="open-tabs-badge">
    ${ICONS.tabs}
    ${t('tabOpen', { count: tabCount })}
  </span>`;

  const dupeBadge = hasDupes
    ? `<span class="open-tabs-badge dupe-badge">
        ${t('duplicates', { count: totalExtras })}
      </span>`
    : '';

  // Deduplicate for display: show each URL once, with (Nx) badge if duped
  const seen = new Set();
  const uniqueTabs = [];
  for (const tab of tabs) {
    if (!seen.has(tab.url)) { seen.add(tab.url); uniqueTabs.push(tab); }
  }

  const isExpanded = expandedDomainKeys.has(group.domain);
  const maxInitialCount = 4;
  const shouldCollapse = uniqueTabs.length > maxInitialCount;
  const displayedTabs = (shouldCollapse && !isExpanded) ? uniqueTabs.slice(0, maxInitialCount) : uniqueTabs;

  const pageChips = displayedTabs.map(tab => {
    let label = cleanTitle(smartTitle(stripTitleNoise(tab.title || ''), tab.url), group.domain);
    try {
      const parsed = new URL(tab.url);
      if (parsed.hostname === 'localhost' && parsed.port) label = `${parsed.port} ${label}`;
    } catch {}
    const count    = urlCounts[tab.url];
    const dupeTag  = count > 1 ? ` <span class="chip-dupe-badge">(${count}x)</span>` : '';
    const chipClass = count > 1 ? ' chip-has-dupes' : '';
    const safeUrl   = escapeHtml(tab.url || '');
    const safeTitle = escapeHtml(label);

    const audibleMarkup = tab.audible
      ? `<button class="chip-audible-btn${tab.muted ? ' is-muted' : ''}" type="button" data-action="toggle-mute-tab" data-tab-id="${tab.id}" title="${tab.muted ? t('unmuteTooltip') : t('muteTooltip')}">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="12" height="12"><path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.414 0-.75-.336-.75-.75V9c0-.414.336-.75.75-.75h2.24Z" /></svg>
        </button>`
      : '';

    const discardedMarkup = tab.discarded
      ? `<span class="chip-discarded-badge" title="${t('discardedTooltip')}">💤</span>`
      : '';

    return `<div class="page-chip clickable${chipClass}" data-action="focus-tab" data-tab-url="${safeUrl}" title="${safeTitle}">
      ${faviconMarkup(tab.url, label, '', hasRealFavicon(tab.favIconUrl))}
      <span class="chip-text">${escapeHtml(label)}</span>${dupeTag}${audibleMarkup}${discardedMarkup}
      <div class="chip-actions">
        <button class="chip-action chip-save" data-action="defer-single-tab" data-tab-url="${safeUrl}" data-tab-title="${safeTitle}" title="${t('savedForLater')}">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" /></svg>
        </button>
        <button class="chip-action chip-close" data-action="close-single-tab" data-tab-url="${safeUrl}" title="${t('tabClosed')}">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>`;
  }).join('');

  let expandToggleHtml = '';
  if (shouldCollapse) {
    const hiddenCount = uniqueTabs.length - maxInitialCount;
    expandToggleHtml = isExpanded
      ? `<button class="chip-expand-btn is-expanded" type="button" data-action="toggle-card-accordion" data-domain-key="${escapeHtml(group.domain)}"><span>${t('collapse')}</span></button>`
      : `<button class="chip-expand-btn" type="button" data-action="toggle-card-accordion" data-domain-key="${escapeHtml(group.domain)}"><span>${t('expandMore', { count: hiddenCount })}</span></button>`;
  }

  let actionsHtml = `
    <button class="action-btn close-tabs" data-action="close-domain-tabs" data-domain-id="${stableId}">
      ${ICONS.close}
      ${t('closeAllTabs', { count: tabCount })}
    </button>`;

  if (hasDupes) {
    const dupeUrlsEncoded = dupeUrls.map(([url]) => encodeURIComponent(url)).join(',');
    actionsHtml += `
      <button class="action-btn" data-action="dedup-keep-one" data-dupe-urls="${dupeUrlsEncoded}">
        ${t('closeDupes', { count: totalExtras })}
      </button>`;
  }

  const domainFaviconMarkup = isLanding
    ? `<span class="domain-title-icon" aria-hidden="true">🏠</span>`
    : faviconMarkup(tabs[0]?.url || 'https://' + group.domain, group.domain, 'favicon-domain-title', hasRealFavicon(tabs[0]?.favIconUrl));

  return `
    <div class="mission-card domain-card ${hasDupes ? 'has-amber-bar' : 'has-neutral-bar'}" data-domain-id="${stableId}">
      <div class="status-bar"></div>
      <div class="mission-content">
        <div class="mission-top">
          <div class="mission-title-row">
            ${domainFaviconMarkup}
            <span class="mission-name">${isLanding ? (getCurrentLanguage() === 'zh-CN' ? '常用主页' : 'Homepages') : (group.label || friendlyDomain(group.domain))}</span>
          </div>
          <div class="mission-badges">
            ${tabBadge}
            ${dupeBadge}
          </div>
        </div>
        <div class="mission-pages">${pageChips}${expandToggleHtml}</div>
        <div class="actions">${actionsHtml}</div>
      </div>
    </div>`;
}


/* ----------------------------------------------------------------
   SAVED FOR LATER — Render Checklist Column
   ---------------------------------------------------------------- */

/**
 * renderDeferredColumn()
 *
 * Reads saved tabs from chrome.storage.local and renders the right-side
 * "Saved for Later" checklist column. Shows active items as a checklist
 * and completed items in a collapsible archive.
 */
async function renderDeferredColumn() {
  const column         = document.getElementById('deferredColumn');
  const list           = document.getElementById('deferredList');
  const empty          = document.getElementById('deferredEmpty');
  const countEl        = document.getElementById('deferredCount');
  const archiveEl      = document.getElementById('deferredArchive');
  const archiveCountEl = document.getElementById('archiveCount');
  const archiveList    = document.getElementById('archiveList');

  if (!column) return;

  try {
    const { active, archived } = await getSavedTabs();

    // Hide the entire column if there's nothing to show
    if (active.length === 0 && archived.length === 0) {
      column.style.display = 'none';
      return;
    }

    column.style.display = 'block';

    // Render active checklist items
    if (active.length > 0) {
      countEl.textContent = `${active.length} item${active.length !== 1 ? 's' : ''}`;
      list.innerHTML = active.map(item => renderDeferredItem(item)).join('');
      list.style.display = 'block';
      empty.style.display = 'none';
    } else {
      list.style.display = 'none';
      countEl.textContent = '';
      empty.style.display = 'block';
    }

    // Render archive section
    if (archived.length > 0) {
      archiveCountEl.textContent = `(${archived.length})`;
      archiveList.innerHTML = archived.map(item => renderArchiveItem(item)).join('');
      archiveEl.style.display = 'block';
    } else {
      archiveEl.style.display = 'none';
    }

  } catch (err) {
    console.warn('[tab-out] Could not load saved tabs:', err);
    column.style.display = 'none';
  }
}

/**
 * renderDeferredItem(item)
 *
 * Builds HTML for one active checklist item: checkbox, title link,
 * domain, time ago, dismiss button.
 */
function renderDeferredItem(item) {
  let domain = '';
  try { domain = new URL(item.url).hostname.replace(/^www\./, ''); } catch {}
  const ago = timeAgo(item.savedAt);
  const title = item.title || item.url;

  return `
    <div class="deferred-item" data-deferred-id="${escapeHtml(item.id)}">
      <input type="checkbox" class="deferred-checkbox" data-action="check-deferred" data-deferred-id="${escapeHtml(item.id)}">
      <div class="deferred-info">
        <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener" class="deferred-title" title="${escapeHtml(title)}">
          ${faviconMarkup(item.url, title, 'favicon-shell-small')}<span>${escapeHtml(title)}</span>
        </a>
        <div class="deferred-meta">
          <span>${escapeHtml(domain)}</span>
          <span>${escapeHtml(ago)}</span>
        </div>
      </div>
      <button class="deferred-dismiss" data-action="dismiss-deferred" data-deferred-id="${escapeHtml(item.id)}" title="Dismiss">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
      </button>
    </div>`;
}

/**
 * renderArchiveItem(item)
 *
 * Builds HTML for one completed/archived item (simpler: just title + date).
 */
function renderArchiveItem(item) {
  const ago = item.completedAt ? timeAgo(item.completedAt) : timeAgo(item.savedAt);
  return `
    <div class="archive-item">
      <a href="${item.url}" target="_blank" rel="noopener" class="archive-item-title" title="${(item.title || '').replace(/"/g, '&quot;')}">
        ${item.title || item.url}
      </a>
      <span class="archive-item-date">${ago}</span>
    </div>`;
}


/* ----------------------------------------------------------------
   MAIN DASHBOARD RENDERER
   ---------------------------------------------------------------- */

/**
 * renderStaticDashboard()
 *
 * The main render function:
 * 1. Paints greeting + date
 * 2. Fetches open tabs via chrome.tabs.query()
 * 3. Groups tabs by domain (with landing pages pulled out to their own group)
 * 4. Renders domain cards
 * 5. Renders the "Saved for Later" checklist
 */
async function renderStaticDashboard() {
  // --- Header ---
  const greetingEl = document.getElementById('greeting');
  const dateEl     = document.getElementById('dateDisplay');
  if (greetingEl) greetingEl.textContent = getGreeting();
  if (dateEl)     dateEl.textContent     = getDateDisplay();

  // --- Fetch tabs ---
  await fetchOpenTabs();
  const realTabs = getRealTabs();

  // --- Group tabs by domain ---
  // Landing pages (Gmail inbox, Twitter home, etc.) get their own special group
  // so they can be closed together without affecting content tabs on the same domain.
  const LANDING_PAGE_PATTERNS = [
    { hostname: 'mail.google.com', test: (p, h) =>
        !h.includes('#inbox/') && !h.includes('#sent/') && !h.includes('#search/') },
    { hostname: 'x.com',               pathExact: ['/home'] },
    { hostname: 'www.linkedin.com',    pathExact: ['/'] },
    { hostname: 'github.com',          pathExact: ['/'] },
    { hostname: 'www.youtube.com',     pathExact: ['/'] },
    // Merge personal patterns from config.local.js (if it exists)
    ...(typeof LOCAL_LANDING_PAGE_PATTERNS !== 'undefined' ? LOCAL_LANDING_PAGE_PATTERNS : []),
  ];

  function isLandingPage(url) {
    try {
      const parsed = new URL(url);
      return LANDING_PAGE_PATTERNS.some(p => {
        // Support both exact hostname and suffix matching (for wildcard subdomains)
        const hostnameMatch = p.hostname
          ? parsed.hostname === p.hostname
          : p.hostnameEndsWith
            ? parsed.hostname.endsWith(p.hostnameEndsWith)
            : false;
        if (!hostnameMatch) return false;
        if (p.test)       return p.test(parsed.pathname, url);
        if (p.pathPrefix) return parsed.pathname.startsWith(p.pathPrefix);
        if (p.pathExact)  return p.pathExact.includes(parsed.pathname);
        return parsed.pathname === '/';
      });
    } catch { return false; }
  }

  domainGroups = [];
  const groupMap    = {};
  const landingTabs = [];

  // Custom group rules from config.local.js (if any)
  const customGroups = typeof LOCAL_CUSTOM_GROUPS !== 'undefined' ? LOCAL_CUSTOM_GROUPS : [];

  // Check if a URL matches a custom group rule; returns the rule or null
  function matchCustomGroup(url) {
    try {
      const parsed = new URL(url);
      return customGroups.find(r => {
        const hostMatch = r.hostname
          ? parsed.hostname === r.hostname
          : r.hostnameEndsWith
            ? parsed.hostname.endsWith(r.hostnameEndsWith)
            : false;
        if (!hostMatch) return false;
        if (r.pathPrefix) return parsed.pathname.startsWith(r.pathPrefix);
        return true; // hostname matched, no path filter
      }) || null;
    } catch { return null; }
  }

  for (const tab of realTabs) {
    try {
      if (isLandingPage(tab.url)) {
        landingTabs.push(tab);
        continue;
      }

      // Check custom group rules first (e.g. merge subdomains, split by path)
      const customRule = matchCustomGroup(tab.url);
      if (customRule) {
        const key = customRule.groupKey;
        if (!groupMap[key]) groupMap[key] = { domain: key, label: customRule.groupLabel, tabs: [] };
        groupMap[key].tabs.push(tab);
        continue;
      }

      let hostname;
      if (tab.url && tab.url.startsWith('file://')) {
        hostname = 'local-files';
      } else {
        hostname = new URL(tab.url).hostname;
      }
      if (!hostname) continue;

      if (!groupMap[hostname]) groupMap[hostname] = { domain: hostname, tabs: [] };
      groupMap[hostname].tabs.push(tab);
    } catch {
      // Skip malformed URLs
    }
  }

  if (landingTabs.length > 0) {
    groupMap['__landing-pages__'] = { domain: '__landing-pages__', tabs: landingTabs };
  }

  // Sort: landing pages first, then domains from landing page sites, then by tab count
  // Collect exact hostnames and suffix patterns for priority sorting
  const landingHostnames = new Set(LANDING_PAGE_PATTERNS.map(p => p.hostname).filter(Boolean));
  const landingSuffixes = LANDING_PAGE_PATTERNS.map(p => p.hostnameEndsWith).filter(Boolean);
  function isLandingDomain(domain) {
    if (landingHostnames.has(domain)) return true;
    return landingSuffixes.some(s => domain.endsWith(s));
  }
  domainGroups = Object.values(groupMap).sort((a, b) => {
    const aIsLanding = a.domain === '__landing-pages__';
    const bIsLanding = b.domain === '__landing-pages__';
    if (aIsLanding !== bIsLanding) return aIsLanding ? -1 : 1;

    const aIsPriority = isLandingDomain(a.domain);
    const bIsPriority = isLandingDomain(b.domain);
    if (aIsPriority !== bIsPriority) return aIsPriority ? -1 : 1;

    return b.tabs.length - a.tabs.length;
  });

  // --- Render domain cards ---
  const openTabsSection      = document.getElementById('openTabsSection');
  const openTabsMissionsEl   = document.getElementById('openTabsMissions');
  const openTabsSectionCount = document.getElementById('openTabsSectionCount');
  const openTabsSectionTitle = document.getElementById('openTabsSectionTitle');

  if (domainGroups.length > 0 && openTabsSection) {
    if (openTabsSectionTitle) openTabsSectionTitle.textContent = t('rightNow');
    openTabsSectionCount.innerHTML = `${t('domainCount', { count: domainGroups.length })} &nbsp;&middot;&nbsp; <button class="action-btn close-tabs" data-action="close-all-open-tabs" style="font-size:11px;padding:3px 10px;">${ICONS.close} ${t('closeAllTabs', { count: realTabs.length })}</button>`;
    openTabsMissionsEl.innerHTML = domainGroups.map(g => renderDomainCard(g)).join('');
    openTabsSection.style.display = 'block';
  } else if (openTabsSection) {
    openTabsSection.style.display = 'none';
  }

  // --- Check for duplicate Tab Out tabs ---
  checkTabOutDupes();

  // --- Render "Saved for Later" column ---
  await renderDeferredColumn();

  // --- Render named workspaces ---
  try {
    await loadWorkspaces();
    renderWorkspaceShelf();
  } catch (error) {
    console.warn('[tab-out] Could not load workspaces:', error);
  }
}

async function renderDashboard() {
  await renderStaticDashboard();
  updateMascotState();
}


/* ----------------------------------------------------------------
   EVENT HANDLERS — using event delegation

   One listener on document handles ALL button clicks.
   Think of it as one security guard watching the whole building
   instead of one per door.
   ---------------------------------------------------------------- */

document.addEventListener('click', async (e) => {
  // Walk up the DOM to find the nearest element with data-action
  const actionEl = e.target.closest('[data-action]');
  if (!actionEl) return;

  const action = actionEl.dataset.action;

  // ---- Command palette ----
  if (action === 'open-command') {
    await openCommandPalette(actionEl);
    return;
  }

  if (action === 'run-command') {
    await executeCommand(Number(actionEl.dataset.commandIndex));
    return;
  }

  // ---- Workspaces ----
  if (action === 'open-workspace-form') {
    const form = document.getElementById('workspaceForm');
    const input = document.getElementById('workspaceName');
    workspaceFormTrigger = actionEl;
    if (form) form.hidden = false;
    if (input) {
      input.value = '';
      input.focus();
    }
    return;
  }

  if (action === 'close-workspace-form') {
    closeWorkspaceForm();
    return;
  }

  if (action === 'restore-workspace') {
    actionEl.disabled = true;
    actionEl.setAttribute('aria-busy', 'true');
    try {
      const result = await restoreWorkspace(actionEl.dataset.workspaceId);
      showToast(workspaceRestoreMessage(result));
      await renderDashboard();
    } finally {
      actionEl.disabled = false;
      actionEl.removeAttribute('aria-busy');
    }
    return;
  }

  if (action === 'delete-workspace') {
    const card = actionEl.closest('.workspace-card');
    const name = card?.querySelector('.workspace-main strong')?.textContent || 'this workspace';
    if (typeof window.confirm === 'function' && !window.confirm(`Delete "${name}"?`)) return;
    await deleteWorkspace(actionEl.dataset.workspaceId);
    renderWorkspaceShelf();
    showToast('Workspace removed');
    return;
  }

  // ---- Personalization drawer ----
  if (action === 'open-personalize') {
    openPersonalization();
    return;
  }

  if (action === 'close-personalize') {
    closePersonalization();
    return;
  }

  if (action === 'preview-background') {
    previewBackground(actionEl.dataset.background || 'paper');
    return;
  }

  if (action === 'remove-background-image') {
    if (!pendingPreferences) return;
    pendingPreferences.backgroundImage = '';
    applyBackground(pendingPreferences);
    updateBackgroundStatus('Custom image removed. Save to keep this change.');
    return;
  }

  // ---- Close duplicate Tab Out tabs ----
  if (action === 'close-tabout-dupes') {
    await closeTabOutDupes();
    playCloseSound();
    const banner = document.getElementById('tabOutDupeBanner');
    if (banner) {
      banner.style.transition = 'opacity 0.4s';
      banner.style.opacity = '0';
      setTimeout(() => { banner.style.display = 'none'; banner.style.opacity = '1'; }, 400);
    }
    showToast('Closed extra Tab Out tabs');
    return;
  }

  // ---- Cyber Woodfish Modal ----
  if (action === 'open-woodfish') {
    openCyberWoodfish();
    return;
  }

  if (action === 'close-woodfish') {
    closeCyberWoodfish();
    return;
  }

  // ---- Arcade Mode Toggle ----
  if (action === 'toggle-arcade') {
    toggleArcadeMode();
    return;
  }

  if (action === 'exit-arcade') {
    if (isArcadeMode) toggleArcadeMode();
    return;
  }

  const card = actionEl.closest('.mission-card');

  // ---- Expand overflow chips ("+N more") ----
  if (action === 'expand-chips') {
    const overflowContainer = actionEl.parentElement.querySelector('.page-chips-overflow');
    if (overflowContainer) {
      overflowContainer.style.display = 'contents';
      actionEl.remove();
    }
    return;
  }

  // ---- Focus a specific tab (or Blast in Arcade Mode) ----
  if (action === 'focus-tab') {
    if (isArcadeMode) {
      fireArcadeLaser(actionEl);
      const tabUrl = actionEl.dataset.tabUrl;
      if (tabUrl) {
        const allTabs = await chrome.tabs.query({});
        const match = allTabs.find(t => t.url === tabUrl);
        if (match) {
          recordClosedTabs([match]);
          await chrome.tabs.remove(match.id);
        }
        await fetchOpenTabs();
        actionEl.style.transition = 'transform 0.2s, opacity 0.2s';
        actionEl.style.transform = 'scale(0) rotate(20deg)';
        actionEl.style.opacity = '0';
        setTimeout(() => {
          actionEl.remove();
          document.querySelectorAll('.mission-card').forEach(c => {
            if (c.querySelectorAll('.page-chip[data-action="focus-tab"]').length === 0) {
              animateCardOut(c);
            }
          });
        }, 200);
        showToast('🎯 标签已被击碎！', { actionText: t('undoShortcut'), onAction: undoLastClosed });
      }
      return;
    }

    const tabUrl = actionEl.dataset.tabUrl;
    if (tabUrl) await focusTab(tabUrl);
    return;
  }

  // ---- Expand / Collapse Card Accordion ----
  if (action === 'toggle-card-accordion') {
    e.stopPropagation();
    const domainKey = actionEl.dataset.domainKey;
    if (domainKey) {
      if (expandedDomainKeys.has(domainKey)) {
        expandedDomainKeys.delete(domainKey);
      } else {
        expandedDomainKeys.add(domainKey);
      }
      await renderStaticDashboard();
    }
    return;
  }

  // ---- Close a single tab ----
  if (action === 'close-single-tab') {
    e.stopPropagation(); // don't trigger parent chip's focus-tab
    const tabUrl = actionEl.dataset.tabUrl;
    if (!tabUrl) return;

    // Record tab before closing for Undo
    const allTabs = await chrome.tabs.query({});
    const match   = allTabs.find(t => t.url === tabUrl);
    if (match) {
      recordClosedTabs([match]);
      await chrome.tabs.remove(match.id);
    }
    await fetchOpenTabs();

    playCloseSound();

    // Animate the chip row out
    const chip = actionEl.closest('.page-chip');
    if (chip) {
      const rect = chip.getBoundingClientRect();
      shootConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
      chip.style.transition = 'opacity 0.2s, transform 0.2s';
      chip.style.opacity    = '0';
      chip.style.transform  = 'scale(0.8)';
      setTimeout(() => {
        chip.remove();
        // If the card now has no tabs, remove it too
        document.querySelectorAll('.mission-card').forEach(c => {
          if (c.querySelectorAll('.page-chip[data-action="focus-tab"]').length === 0) {
            animateCardOut(c);
          }
        });
      }, 200);
    }

    showToast(t('tabClosed'), { actionText: t('undoShortcut'), onAction: undoLastClosed });
    return;
  }

  // ---- Save a single tab for later (then close it) ----
  if (action === 'defer-single-tab') {
    e.stopPropagation();
    const tabUrl   = actionEl.dataset.tabUrl;
    const tabTitle = actionEl.dataset.tabTitle || tabUrl;
    if (!tabUrl) return;

    // Save to chrome.storage.local
    try {
      await saveTabForLater({ url: tabUrl, title: tabTitle });
    } catch (err) {
      console.error('[tab-out] Failed to save tab:', err);
      showToast('Failed to save tab');
      return;
    }

    // Close the tab in Chrome
    const allTabs = await chrome.tabs.query({});
    const match   = allTabs.find(t => t.url === tabUrl);
    if (match) await chrome.tabs.remove(match.id);
    await fetchOpenTabs();

    // Animate chip out
    const chip = actionEl.closest('.page-chip');
    if (chip) {
      chip.style.transition = 'opacity 0.2s, transform 0.2s';
      chip.style.opacity    = '0';
      chip.style.transform  = 'scale(0.8)';
      setTimeout(() => chip.remove(), 200);
    }

    showToast(t('tabSaved'));
    await renderDeferredColumn();
    return;
  }

  // ---- Check off a saved tab (moves it to archive) ----
  if (action === 'check-deferred') {
    const id = actionEl.dataset.deferredId;
    if (!id) return;

    await checkOffSavedTab(id);

    // Animate: strikethrough first, then slide out
    const item = actionEl.closest('.deferred-item');
    if (item) {
      item.classList.add('checked');
      setTimeout(() => {
        item.classList.add('removing');
        setTimeout(() => {
          item.remove();
          renderDeferredColumn(); // refresh counts and archive
        }, 300);
      }, 800);
    }
    return;
  }

  // ---- Dismiss a saved tab (removes it entirely) ----
  if (action === 'dismiss-deferred') {
    const id = actionEl.dataset.deferredId;
    if (!id) return;

    await dismissSavedTab(id);

    const item = actionEl.closest('.deferred-item');
    if (item) {
      item.classList.add('removing');
      setTimeout(() => {
        item.remove();
        renderDeferredColumn();
      }, 300);
    }
    return;
  }

  // ---- Close all tabs in a domain group ----
  if (action === 'close-domain-tabs') {
    const domainId = actionEl.dataset.domainId;
    const group    = domainGroups.find(g => {
      return 'domain-' + g.domain.replace(/[^a-z0-9]/g, '-') === domainId;
    });
    if (!group) return;

    if (group.tabs && group.tabs.length > 0) {
      recordClosedTabs(group.tabs);
    }

    const urls      = group.tabs.map(t => t.url);
    const useExact  = group.domain === '__landing-pages__' || !!group.label;

    if (useExact) {
      await closeTabsExact(urls);
    } else {
      await closeTabsByUrls(urls);
    }

    if (card) {
      playCloseSound();
      animateCardOut(card);
    }

    // Remove from in-memory groups
    const idx = domainGroups.indexOf(group);
    if (idx !== -1) domainGroups.splice(idx, 1);

    const groupLabel = group.domain === '__landing-pages__' ? (getCurrentLanguage() === 'zh-CN' ? '常用主页' : 'Homepages') : (group.label || friendlyDomain(group.domain));
    showToast(`${t('tabClosed')} (${urls.length} · ${groupLabel})`, { actionText: t('undoShortcut'), onAction: undoLastClosed });

    return;
  }

  // ---- Close duplicates, keep one copy ----
  if (action === 'dedup-keep-one') {
    const urlsEncoded = actionEl.dataset.dupeUrls || '';
    const urls = urlsEncoded.split(',').map(u => decodeURIComponent(u)).filter(Boolean);
    if (urls.length === 0) return;

    // Find duplicates that will be closed to record for undo
    const allTabs = await chrome.tabs.query({});
    const urlCount = {};
    const dupesToClose = [];
    for (const tab of allTabs) {
      if (urls.includes(tab.url)) {
        urlCount[tab.url] = (urlCount[tab.url] || 0) + 1;
        if (urlCount[tab.url] > 1) {
          dupesToClose.push(tab);
        }
      }
    }
    if (dupesToClose.length > 0) recordClosedTabs(dupesToClose);

    await closeDuplicateTabs(urls, true);
    playCloseSound();

    // Hide the dedup button
    actionEl.style.transition = 'opacity 0.2s';
    actionEl.style.opacity    = '0';
    setTimeout(() => actionEl.remove(), 200);

    // Remove dupe badges from the card
    if (card) {
      card.querySelectorAll('.chip-dupe-badge').forEach(b => {
        b.style.transition = 'opacity 0.2s';
        b.style.opacity    = '0';
        setTimeout(() => b.remove(), 200);
      });
      card.querySelectorAll('.open-tabs-badge.dupe-badge').forEach(badge => {
        badge.style.transition = 'opacity 0.2s';
        badge.style.opacity    = '0';
        setTimeout(() => badge.remove(), 200);
      });
      card.classList.remove('has-amber-bar');
      card.classList.add('has-neutral-bar');
    }

    showToast(t('closeDupes', { count: urls.length }), { actionText: t('undoShortcut'), onAction: undoLastClosed });
    return;
  }

  // ---- Close ALL open tabs ----
  if (action === 'close-all-open-tabs') {
    const realTabs = openTabs.filter(t => t.url && !t.url.startsWith('chrome') && !t.url.startsWith('about:'));
    if (realTabs.length > 0) recordClosedTabs(realTabs);

    const allUrls = realTabs.map(t => t.url);
    await closeTabsByUrls(allUrls);
    playCloseSound();

    document.querySelectorAll('#openTabsMissions .mission-card').forEach(c => {
      shootConfetti(
        c.getBoundingClientRect().left + c.offsetWidth / 2,
        c.getBoundingClientRect().top  + c.offsetHeight / 2
      );
      animateCardOut(c);
    });

    showToast(t('tabClosed'), { actionText: t('undoShortcut'), onAction: undoLastClosed });
    return;
  }

  // ---- Toggle Tab Mute ----
  if (action === 'toggle-mute-tab') {
    e.stopPropagation();
    const tabId = Number(actionEl.dataset.tabId);
    if (!Number.isInteger(tabId)) return;
    await toggleTabMute(tabId);
    return;
  }

  // ---- Discard inactive background tabs ----
  if (action === 'discard-inactive-tabs') {
    await discardInactiveTabs();
    return;
  }

  // ---- Export data backup JSON ----
  if (action === 'export-backup') {
    await exportUserData();
    return;
  }
});

/**
 * toggleTabMute(tabId)
 */
async function toggleTabMute(tabId) {
  try {
    const tab = openTabs.find(t => t.id === tabId);
    const currentlyMuted = Boolean(tab?.muted);
    await chrome.tabs.update(tabId, { muted: !currentlyMuted });
    if (tab) tab.muted = !currentlyMuted;
    showToast(!currentlyMuted ? t('tabMuted') : t('tabUnmuted'));
    await renderDashboard();
  } catch (err) {
    console.warn('[tab-out] Could not update tab mute status:', err);
  }
}

/**
 * discardInactiveTabs()
 * Free RAM by freezing background tabs.
 */
async function discardInactiveTabs() {
  try {
    const tabs = await chrome.tabs.query({});
    let count = 0;
    for (const tab of tabs) {
      if (tab.active || tab.audible || tab.discarded || !tab.id) continue;
      const url = tab.url || '';
      if (url.startsWith('chrome://') || url.startsWith('chrome-extension://') || url.startsWith('about:')) continue;
      try {
        await chrome.tabs.discard(tab.id);
        count++;
      } catch {}
    }
    showToast(t('freezeDone', { count }));
    await fetchOpenTabs();
    await renderDashboard();
  } catch (err) {
    console.error('[tab-out] Discard tabs failed:', err);
  }
}

/**
 * exportUserData()
 */
async function exportUserData() {
  try {
    const stored = await chrome.storage.local.get(null);
    const exportPayload = {
      app: 'Tab Out',
      version: '1.3.0',
      exportedAt: new Date().toISOString(),
      workspaces: stored[WORKSPACES_KEY] || [],
      savedTabs: stored['tabOutSavedTabs'] || [],
      preferences: stored[PREFERENCES_KEY] || {},
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tab-out-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(t('exportSuccess'));
  } catch (err) {
    console.error('[tab-out] Export failed:', err);
    showToast('Export failed');
  }
}

/**
 * importUserData(file)
 */
async function importUserData(file) {
  if (!file) return;
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    if (!data || typeof data !== 'object') throw new Error('Invalid JSON');

    const incomingWorkspaces = Array.isArray(data.workspaces) ? data.workspaces : [];
    const incomingSaved = Array.isArray(data.savedTabs) ? data.savedTabs : [];
    const incomingPrefs = data.preferences && typeof data.preferences === 'object' ? data.preferences : {};

    if (incomingWorkspaces.length > 0) {
      const existing = await chrome.storage.local.get(WORKSPACES_KEY);
      const current = existing[WORKSPACES_KEY] || [];
      const mergedMap = new Map();
      current.forEach(w => mergedMap.set(w.id, w));
      incomingWorkspaces.forEach(w => mergedMap.set(w.id, w));
      await chrome.storage.local.set({ [WORKSPACES_KEY]: Array.from(mergedMap.values()).slice(0, MAX_WORKSPACES) });
    }

    if (incomingSaved.length > 0) {
      const existing = await chrome.storage.local.get('tabOutSavedTabs');
      const current = existing['tabOutSavedTabs'] || [];
      const mergedMap = new Map();
      current.forEach(item => mergedMap.set(item.id || item.url, item));
      incomingSaved.forEach(item => mergedMap.set(item.id || item.url, item));
      await chrome.storage.local.set({ tabOutSavedTabs: Array.from(mergedMap.values()) });
    }

    if (Object.keys(incomingPrefs).length > 0) {
      const mergedPrefs = { ...preferences, ...incomingPrefs };
      await chrome.storage.local.set({ [PREFERENCES_KEY]: mergedPrefs });
      preferences = mergedPrefs;
    }

    showToast(t('importSuccess', { workspaces: incomingWorkspaces.length, saved: incomingSaved.length }));
    await loadPreferences();
    await loadWorkspaces();
    await renderDashboard();
  } catch (err) {
    console.error('[tab-out] Import failed:', err);
    showToast(t('importError'));
  }
}

// ---- Archive toggle — expand/collapse the archive section ----
document.addEventListener('click', (e) => {
  const toggle = e.target.closest('#archiveToggle');
  if (!toggle) return;

  toggle.classList.toggle('open');
  const body = document.getElementById('archiveBody');
  if (body) {
    body.style.display = body.style.display === 'none' ? 'block' : 'none';
  }
});

// ---- Archive search — filter archived items as user types ----
document.addEventListener('input', async (e) => {
  if (e.target.id === 'commandInput') {
    commandSelection = 0;
    renderCommandResults();
    return;
  }

  if (e.target.id !== 'archiveSearch') return;

  const q = e.target.value.trim().toLowerCase();
  const archiveList = document.getElementById('archiveList');
  if (!archiveList) return;

  try {
    const { archived } = await getSavedTabs();

    if (q.length < 2) {
      // Show all archived items
      archiveList.innerHTML = archived.map(item => renderArchiveItem(item)).join('');
      return;
    }

    // Filter by title or URL containing the query string
    const results = archived.filter(item =>
      (item.title || '').toLowerCase().includes(q) ||
      (item.url  || '').toLowerCase().includes(q)
    );

    archiveList.innerHTML = results.map(item => renderArchiveItem(item)).join('')
      || '<div style="font-size:12px;color:var(--muted);padding:8px 0">No results</div>';
  } catch (err) {
    console.warn('[tab-out] Archive search failed:', err);
  }
});

// ---- File input listener for JSON Backup Import ----
document.getElementById('importBackupInput')?.addEventListener('change', async (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  await importUserData(file);
  e.target.value = '';
});

// ---- Personalization form and image upload ----
document.getElementById('personalizeForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!pendingPreferences) return;

  const cityInput = document.getElementById('weatherCity');
  const langSelect = document.getElementById('settingLanguage');
  const soundCheckbox = document.getElementById('settingSound');
  const soundPackSelect = document.getElementById('settingSoundPack');
  const confettiCheckbox = document.getElementById('settingConfetti');
  const mascotCheckbox = document.getElementById('settingMascot');
  const catColorSelect = document.getElementById('settingCatColor');

  pendingPreferences.city = cityInput ? cityInput.value.trim() : '';
  pendingPreferences.language = langSelect ? langSelect.value : 'auto';
  pendingPreferences.soundEnabled = soundCheckbox ? soundCheckbox.checked : true;
  pendingPreferences.soundPack = soundPackSelect ? soundPackSelect.value : 'swoosh';
  pendingPreferences.confettiEnabled = confettiCheckbox ? confettiCheckbox.checked : true;
  pendingPreferences.mascotEnabled = mascotCheckbox ? mascotCheckbox.checked : true;
  pendingPreferences.catColor = catColorSelect ? catColorSelect.value : 'orange';

  const nextPreferences = { ...DEFAULT_PREFERENCES, ...pendingPreferences };

  try {
    await chrome.storage.local.set({ [PREFERENCES_KEY]: nextPreferences });
    preferences = nextPreferences;
    applyBackground(preferences);
    updateStaticI18n();
    updateMascotState();
    closePersonalization(false);
    showToast(t('deskUpdated'));
    await refreshWeather();
    await renderDashboard();
  } catch (error) {
    console.error('[tab-out] Could not save preferences:', error);
    showToast('Could not save those settings');
  }
});

document.getElementById('backgroundUpload')?.addEventListener('change', async (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file || !pendingPreferences) return;

  const draft = pendingPreferences;
  const saveButton = document.querySelector('#personalizeForm [type="submit"]');
  if (saveButton) saveButton.disabled = true;
  updateBackgroundStatus('Preparing your image…');
  try {
    const imageData = await compressBackgroundImage(file);
    if (pendingPreferences !== draft) return;
    draft.backgroundImage = imageData;
    applyBackground(draft);
    updateBackgroundStatus();
  } catch (error) {
    updateBackgroundStatus(error.message || 'Could not use that image');
  } finally {
    if (saveButton) saveButton.disabled = false;
    e.target.value = '';
  }
});

document.getElementById('personalizeBackdrop')?.addEventListener('click', (e) => {
  if (e.target.id === 'personalizeBackdrop') closePersonalization();
});

document.getElementById('workspaceForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  const input = document.getElementById('workspaceName');
  const submitButton = form.querySelector('[type="submit"]');
  if (!input) return;

  if (submitButton) submitButton.disabled = true;
  try {
    const workspace = await saveCurrentWorkspace(input.value);
    renderWorkspaceShelf();
    closeWorkspaceForm();
    showToast(`Saved ${workspace.tabs.length} tabs as ${workspace.name}`);
  } catch (error) {
    showToast(error.message || 'Could not save this workspace');
    input.focus();
  } finally {
    if (submitButton) submitButton.disabled = false;
  }
});

document.getElementById('commandBackdrop')?.addEventListener('click', (e) => {
  if (e.target.id === 'commandBackdrop') closeCommandPalette();
});

document.getElementById('mascotStage')?.addEventListener('click', petMascot);
document.getElementById('woodfishStage')?.addEventListener('click', knockWoodfish);
document.getElementById('woodfishBackdrop')?.addEventListener('click', (e) => {
  if (e.target.id === 'woodfishBackdrop') closeCyberWoodfish();
});

document.addEventListener('keydown', (e) => {
  const commandBackdrop = document.getElementById('commandBackdrop');
  const commandIsOpen = commandBackdrop && !commandBackdrop.hidden;

  // Exit Arcade Mode on ESC
  if (e.key === 'Escape' && isArcadeMode) {
    toggleArcadeMode();
    return;
  }

  // Undo (Cmd+Z or Ctrl+Z)
  if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
    const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
    if (activeTag !== 'input' && activeTag !== 'textarea' && !document.activeElement?.isContentEditable) {
      e.preventDefault();
      undoLastClosed();
      return;
    }
  }

  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    if (commandIsOpen) closeCommandPalette();
    else openCommandPalette(document.activeElement);
    return;
  }

  if (commandIsOpen) {
    const count = Number(document.getElementById('commandResults')?.dataset.matchCount || 0);
    if (e.key === 'Tab') {
      e.preventDefault();
      document.getElementById('commandInput')?.focus();
      return;
    }
    if (e.key === 'ArrowDown' && count > 0) {
      e.preventDefault();
      commandSelection = (commandSelection + 1) % count;
      renderCommandResults();
      document.getElementById(`command-result-${commandSelection}`)?.scrollIntoView({ block: 'nearest' });
      return;
    }
    if (e.key === 'ArrowUp' && count > 0) {
      e.preventDefault();
      commandSelection = (commandSelection - 1 + count) % count;
      renderCommandResults();
      document.getElementById(`command-result-${commandSelection}`)?.scrollIntoView({ block: 'nearest' });
      return;
    }
    if (e.key === 'Enter' && e.target.id === 'commandInput') {
      e.preventDefault();
      executeCommand(commandSelection);
      return;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      closeCommandPalette();
      return;
    }
  }

  if (e.key === 'Escape') {
    const workspaceForm = document.getElementById('workspaceForm');
    if (workspaceForm && !workspaceForm.hidden) closeWorkspaceForm();
    closePersonalization();
    closeCyberWoodfish();
  }
});


/* ----------------------------------------------------------------
   INITIALIZE
   ---------------------------------------------------------------- */
updateClock();
setInterval(updateClock, 30 * 1000);
loadPreferences();
renderDashboard();
initCat3DTracking();

const commandShortcut = document.querySelector('.command-btn kbd');
if (commandShortcut && typeof navigator !== 'undefined' && !/Mac|iPhone|iPad/.test(navigator.platform)) {
  commandShortcut.textContent = 'Ctrl K';
}

