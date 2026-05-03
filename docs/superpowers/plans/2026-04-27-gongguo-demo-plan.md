# Gongguo Beans Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local static demo that showcases the first-version Gongguo Beans homepage, bean drop/cancel interaction, day summary overlay, and a share-card preview.

**Architecture:** Use a tiny static web prototype with one HTML entry, one stylesheet, and one JavaScript file. Keep all demo state in memory so the visual direction and core interaction can be reviewed quickly before moving into real mini-program implementation.

**Tech Stack:** HTML, CSS, vanilla JavaScript

---

### Task 1: Scaffold Static Demo Shell

**Files:**
- Create: `D:\CodexWorkspace\DailyTalk\demo\index.html`
- Create: `D:\CodexWorkspace\DailyTalk\demo\styles.css`
- Create: `D:\CodexWorkspace\DailyTalk\demo\app.js`

- [ ] **Step 1: Create the HTML shell**

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>功过豆 Demo</title>
    <link rel="stylesheet" href="./styles.css" />
  </head>
  <body>
    <div class="page-shell">
      <main class="board">
        <header class="board-header">
          <p class="board-date">四月二十七</p>
          <h1>今日功过案</h1>
          <p class="board-subtitle">日积一念，功过自明</p>
        </header>

        <section class="tray-grid">
          <article class="tray tray-gong">
            <div class="tray-label">功槽</div>
            <div class="bean-pit" id="gongPit"></div>
            <div class="tray-meta"><span id="gongCount">0</span> 颗赤豆</div>
          </article>

          <article class="center-status">
            <div class="status-ring" id="statusRing">
              <span class="status-caption">今日净势</span>
              <strong id="netLabel">相抵</strong>
            </div>
            <p class="status-note" id="statusNote">起心动念，都可轻轻记下一笔。</p>
          </article>

          <article class="tray tray-guo">
            <div class="tray-label">过槽</div>
            <div class="bean-pit" id="guoPit"></div>
            <div class="tray-meta"><span id="guoCount">0</span> 颗青豆</div>
          </article>
        </section>

        <section class="action-row">
          <button class="action-btn action-gong" id="addGong">记一功</button>
          <button class="action-btn action-guo" id="addGuo">记一过</button>
        </section>

        <section class="board-footer">
          <button class="ghost-btn" id="openSummary">查看今日小结</button>
          <button class="ghost-btn" id="openShare">预览分享卡片</button>
        </section>
      </main>

      <aside class="history-card">
        <div class="history-title">近七日</div>
        <ul id="historyList"></ul>
      </aside>
    </div>

    <dialog class="sheet" id="summarySheet">
      <div class="sheet-card">
        <p class="sheet-kicker">今日小结</p>
        <h2 id="summaryLabel">功过相抵</h2>
        <p id="summaryCounts">赤豆 0 · 青豆 0</p>
        <p class="sheet-copy" id="summaryCopy">有得有失，记下便好。</p>
        <button class="sheet-close" data-close="summarySheet">收起</button>
      </div>
    </dialog>

    <dialog class="sheet" id="shareSheet">
      <div class="share-card">
        <p class="share-date">2026.04.27</p>
        <h2 class="share-title">今日功过，已记一页</h2>
        <div class="share-beans">
          <div class="share-pile share-gong" id="shareGong"></div>
          <div class="share-divider"></div>
          <div class="share-pile share-guo" id="shareGuo"></div>
        </div>
        <p class="share-result" id="shareResult">相抵</p>
        <p class="share-copy" id="shareCopy">我在这里轻记一日功过。</p>
        <button class="sheet-close" data-close="shareSheet">收起</button>
      </div>
    </dialog>

    <script src="./app.js"></script>
  </body>
</html>
```

- [ ] **Step 2: Create the base stylesheet**

```css
:root {
  --paper: #f4ead9;
  --paper-deep: #ead7bc;
  --wood: #a7774f;
  --wood-shadow: #7c5438;
  --ink: #33261c;
  --muted: #74604f;
  --gong: #b74638;
  --gong-soft: #de8f79;
  --guo: #52717d;
  --guo-soft: #8ca8b2;
  --gold: #d4b06b;
}
```

- [ ] **Step 3: Create the initial script scaffold**

```js
const state = {
  gong: 0,
  guo: 0,
  history: [
    { date: "四月二十六", result: "偏功", gong: 2, guo: 0 },
    { date: "四月二十五", result: "相抵", gong: 1, guo: 1 },
    { date: "四月二十四", result: "偏过", gong: 0, guo: 2 },
  ],
};
```

- [ ] **Step 4: Verify files exist**

Run: `Get-ChildItem 'D:\CodexWorkspace\DailyTalk\demo'`
Expected: `index.html`, `styles.css`, `app.js`

### Task 2: Implement Visual Design and Layout

**Files:**
- Modify: `D:\CodexWorkspace\DailyTalk\demo\styles.css`

- [ ] **Step 1: Style the board layout**

```css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  font-family: "Microsoft YaHei UI", "PingFang SC", sans-serif;
  color: var(--ink);
  background:
    radial-gradient(circle at top, rgba(255, 255, 255, 0.35), transparent 28%),
    linear-gradient(180deg, #ddc3a1 0%, #f6efe3 44%, #ead5b7 100%);
}
```

- [ ] **Step 2: Style the main board and tray composition**

```css
.page-shell {
  width: min(1180px, calc(100vw - 32px));
  margin: 0 auto;
  padding: 32px 0 40px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 260px;
  gap: 24px;
  align-items: start;
}

.board {
  position: relative;
  overflow: hidden;
  border-radius: 32px;
  padding: 32px;
  background:
    linear-gradient(145deg, rgba(255, 248, 238, 0.92), rgba(240, 224, 198, 0.92)),
    var(--paper);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.6),
    0 24px 60px rgba(82, 52, 24, 0.16);
}
```

- [ ] **Step 3: Style the beans, buttons, and modal cards**

```css
.bean {
  width: 16px;
  height: 22px;
  border-radius: 999px;
  box-shadow: inset 0 2px 3px rgba(255, 255, 255, 0.35), 0 4px 6px rgba(0, 0, 0, 0.14);
}

.bean-gong {
  background: linear-gradient(180deg, #cf6958 0%, var(--gong) 100%);
}

.bean-guo {
  background: linear-gradient(180deg, #7894a0 0%, var(--guo) 100%);
}
```

- [ ] **Step 4: Verify responsive layout is present**

Run: `Select-String -Path 'D:\CodexWorkspace\DailyTalk\demo\styles.css' -Pattern '@media'`
Expected: one responsive media rule for narrow screens

### Task 3: Implement Demo State and Interactions

**Files:**
- Modify: `D:\CodexWorkspace\DailyTalk\demo\app.js`

- [ ] **Step 1: Render the current state**

```js
function render() {
  renderPit("gongPit", state.gong, "gong");
  renderPit("guoPit", state.guo, "guo");
  document.getElementById("gongCount").textContent = String(state.gong);
  document.getElementById("guoCount").textContent = String(state.guo);
}
```

- [ ] **Step 2: Implement add and cancel logic**

```js
function addGong() {
  if (state.guo > 0) {
    state.guo -= 1;
    setStatus("相抵", "功过相抵，仍可再正。");
  } else {
    state.gong += 1;
    setStatus("偏功", "善念记下了。");
  }
  render();
}
```

- [ ] **Step 3: Wire dialogs and share preview**

```js
document.getElementById("openSummary").addEventListener("click", () => {
  syncSummary();
  document.getElementById("summarySheet").showModal();
});
```

- [ ] **Step 4: Verify no syntax errors**

Run: `node --check 'D:\CodexWorkspace\DailyTalk\demo\app.js'`
Expected: no output

### Task 4: Smoke Test the Demo

**Files:**
- Test: `D:\CodexWorkspace\DailyTalk\demo\index.html`

- [ ] **Step 1: Run a local static server**

Run: `python -m http.server 4173`
Expected: `Serving HTTP on`

- [ ] **Step 2: Open the demo in the in-app browser**

Open: `http://127.0.0.1:4173/demo/index.html`
Expected: board layout loads, buttons clickable, summary and share cards open

- [ ] **Step 3: Verify the core interactions**

Checklist:
- Click `记一功` and see a red bean appear
- Click `记一过` after one red bean and see cancel behavior
- Open `查看今日小结`
- Open `预览分享卡片`
- Resize to a narrow viewport and confirm layout stacks cleanly

- [ ] **Step 4: Document the demo entry**

Run: `Get-Item 'D:\CodexWorkspace\DailyTalk\demo\index.html' | Select-Object FullName,Length`
Expected: file exists with non-zero length
