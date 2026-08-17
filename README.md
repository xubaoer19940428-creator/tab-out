# Tab Out

**Keep tabs on your tabs · 优雅管理你的 Chrome 标签页**

Tab Out is a modern, lightweight Chrome extension (Manifest V3) that replaces your new tab page with a clean dashboard of everything you have open. Tabs are grouped by domain, with homepages (Gmail, X, GitHub, etc.) pulled into their own group. Close tabs with a satisfying swoosh + confetti burst, or save setups into named workspaces.

Tab Out 是一款轻量优雅的 Chrome 标签页管理扩展（基于 Manifest V3）。它将新标签页替换为按域名聚合的可视化管理仪表盘，支持常用主页归类、重复标签检测与一键清理、标签发声与静音、休眠内存释放、中英双语切换以及工作区 JSON 备份与恢复。

---

## ✨ Features / 核心功能

- 🗂️ **Domain Grouping / 域名自动聚合**：See all your tabs at a glance on a clean grid, grouped by domain.
- ↩️ **Undo Last Closed (⌘Z) / 撤销防手滑**：Accidentally closed a tab or a whole domain card? Press `⌘Z` / `Ctrl+Z` or click the Toast floating island to instantly restore pages.
- 📂 **Card Accordion / 长标签智能折叠**：Domain cards with >4 tabs automatically collapse with an interactive "+N more" capsule, maintaining a neat Bento layout.
- 🏠 **Homepages Card / 常用主页分组**：Pulls Gmail, X (Twitter), YouTube, LinkedIn, and GitHub homepages into a top card for quick decluttering.
- 🎉 **Close with Style / 优雅关闭反馈**：Web Audio swoosh sound + confetti burst when closing tabs (sound & motion toggleable in settings).
- 🧹 **Duplicate Detection / 重复标签检测**：Flags tabs opened more than once with a `(2x)` badge and provides one-click cleanup.
- 🌐 **Multi-Language Support / 中英双语切换**：Seamlessly switches between Simplified Chinese (简体中文) and English (US).
- 🔊 **Audio & Mute Control / 发声感知与一键静音**：Identifies tabs playing audio and lets you mute/unmute with a single click.
- ⚡ **Memory Saver / 内存释放休眠**：Identifies sleeping tabs and provides "Free up RAM" to suspend inactive background tabs without closing them.
- 💾 **Data Backup & Restore / JSON 导入与导出**：Export/import all workspaces, preferences, and saved tabs to prevent data loss.
- 📌 **Save for Later / 稍后阅读清单**：Bookmark tabs to a sidebar checklist before closing them.
- 💼 **Named Workspaces / 命名工作区**：Save your current tab environment and restore missing tabs later.
- 🔍 **Quick Switcher / 全局快捷搜索**：Press `⌘K` (Mac) or `Ctrl+K` (Windows/Linux) to search tabs, saved links, workspaces, and execute quick actions.
- 💻 **Localhost Project Awareness / 本地端口识别**：Shows port numbers for localhost tabs to distinguish vibe coding dev servers.
- 🔒 **Privacy First / 隐私安全**：Pure local storage (`chrome.storage.local`). No analytics, no accounts, zero tracking. Weather is opt-in via Open-Meteo.

---

## 🚀 Installation / 安装使用

### 1. Clone the repository / 克隆仓库

```bash
git clone https://github.com/xubaoer19940428-creator/tab-out.git
cd tab-out
```

### 2. Load into Chrome / 加载至 Chrome 浏览器

1. Open Chrome and navigate to `chrome://extensions/`
2. Toggle on **Developer mode** in the top-right corner
3. Click **Load unpacked** in the top-left corner
4. Select the `extension/` directory inside this repository
5. Open a new tab (`⌘T` / `Ctrl+T`) and enjoy Tab Out!

---

## ⌨️ Shortcuts / 常用快捷键

| Shortcut / 快捷键 | Action / 动作 |
| :--- | :--- |
| `⌘Z` / `Ctrl+Z` | Undo Closed Tabs / 撤销最近关闭的标签或卡片 |
| `⌘K` / `Ctrl+K` | Open Command Palette / 打开全局指令与搜索面板 |
| `Esc` | Close Drawer or Command Palette / 关闭面板或抽屉 |
| `↑` / `↓` | Navigate Command Results / 切换选中的搜索项 |
| `Enter` | Jump to tab or restore workspace / 跳转到标签或恢复工作区 |

---

## 🛠️ Tech Stack / 技术架构

| Component / 组件 | Technology / 实现方案 |
| :--- | :--- |
| **Extension Model** | Chrome Manifest V3 (Zero-Backend) |
| **Storage** | `chrome.storage.local` (Local persistent storage) |
| **Audio** | Web Audio API (Synthesized swoosh, no media files) |
| **Weather** | Open-Meteo REST API (Opt-in, cached locally 30 mins) |
| **Styling** | Vanilla CSS + CSS Custom Properties + Glassmorphism |

---

## 📄 License

[MIT License](LICENSE) © 2026 [xubaoer19940428-creator](https://github.com/xubaoer19940428-creator)
