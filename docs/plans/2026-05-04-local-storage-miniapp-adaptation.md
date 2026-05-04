# 微信小程序本地存储适配 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the existing Shounian Box mini program run as a stable local-storage-only WeChat Mini Program with date rollover, archive normalization, and basic developer setup.

**Architecture:** Keep all persistence behind `record-service`, let `utils/date` own date keys and display formatting, and keep pages thin so they only render normalized records. Add a WeChat project config and update docs so the app can be opened directly in WeChat DevTools without any login, user-info, or cloud dependencies.

**Tech Stack:** WeChat Mini Program, JavaScript, WXSS, local storage APIs, WeChat DevTools

---

### Task 1: Add WeChat project configuration and developer notes

**Files:**
- Create: `project.config.json`
- Modify: `README.md`

- [ ] **Step 1: Create the project config**

```json
{
  "appid": "touristappid",
  "compileType": "miniprogram",
  "miniprogramRoot": "miniprogram/",
  "setting": {
    "es6": true,
    "enhance": true,
    "urlCheck": false,
    "minified": true
  },
  "condition": {},
  "libVersion": "3.4.4"
}
```

- [ ] **Step 2: Add developer instructions to the README**

```md
## 开发方式 / Development

1. 在微信开发者工具中导入仓库根目录。
2. 工程入口指向 `miniprogram/`。
3. 当前版本不需要微信登录、头像、手机号或云开发。
4. 数据全部保存在本地微信 storage 中。
5. 测试时可先清空本地缓存，再重新打开首页验证首日状态。
```

- [ ] **Step 3: Verify the config is discoverable**

Run:
```bash
sed -n '1,220p' project.config.json
```

Expected:
- JSON contains `compileType: "miniprogram"`
- JSON contains `miniprogramRoot: "miniprogram/"`

---

### Task 2: Normalize local storage records and add date rollover helpers

**Files:**
- Modify: `miniprogram/utils/date.js`
- Modify: `miniprogram/services/record-service.js`
- Modify: `miniprogram/utils/storage.js` if a small guard is needed for broken storage payloads

- [ ] **Step 1: Extend date helpers with comparison support**

```js
function compareDateKey(left, right) {
  if (left === right) {
    return 0;
  }

  return left < right ? -1 : 1;
}

function isBeforeDateKey(left, right) {
  return compareDateKey(left, right) < 0;
}

function isAfterDateKey(left, right) {
  return compareDateKey(left, right) > 0;
}
```

- [ ] **Step 2: Add normalized record creation and cleanup in the service**

```js
function createEmptyRecords(dateKey = getDateKey()) {
  return {
    version: 1,
    today: createDayRecord(dateKey),
    archive: [],
  };
}

function normalizeSlip(slip) {
  return {
    text: typeof slip?.text === "string" ? slip.text : "",
    createdAt: typeof slip?.createdAt === "number" ? slip.createdAt : Date.now(),
  };
}

function normalizeDay(day, dateKey) {
  const source = day && typeof day === "object" ? day : {};

  return {
    dateKey: typeof source.dateKey === "string" ? source.dateKey : dateKey,
    gong: Array.isArray(source.gong) ? source.gong.map(normalizeSlip) : [],
    guo: Array.isArray(source.guo) ? source.guo.map(normalizeSlip) : [],
    sealed: Boolean(source.sealed),
    sealedAt: typeof source.sealedAt === "number" ? source.sealedAt : null,
  };
}

function normalizeRecords(rawRecords, todayKey = getDateKey()) {
  if (!rawRecords || typeof rawRecords !== "object") {
    return createEmptyRecords(todayKey);
  }

  const normalizedToday = normalizeDay(rawRecords.today, todayKey);
  const normalizedArchive = Array.isArray(rawRecords.archive)
    ? rawRecords.archive.map((day) => normalizeDay(day, day?.dateKey || todayKey))
    : [];

  const records = {
    version: 1,
    today: normalizedToday,
    archive: normalizedArchive,
  };

  if (isBeforeDateKey(records.today.dateKey, todayKey)) {
    const shouldArchive = records.today.gong.length > 0 || records.today.guo.length > 0;

    if (shouldArchive) {
      records.archive = upsertArchive(
        records.archive,
        createArchiveEntry({
          ...records.today,
          dateKey: records.today.dateKey,
          sealed: true,
        }),
      );
    }

    records.today = createDayRecord(todayKey);
  }

  if (isAfterDateKey(records.today.dateKey, todayKey)) {
    records.today = createDayRecord(todayKey);
  }

  return {
    ...records,
    archive: dedupeArchive(records.archive),
  };
}
```

- [ ] **Step 3: Make loading always return a normalized structure**

```js
function loadRecords() {
  const rawRecords = readStorage(STORAGE_KEY, null);
  return normalizeRecords(rawRecords, getDateKey());
}
```

- [ ] **Step 4: Ensure saving writes back the normalized shape**

```js
function saveRecords(records) {
  writeStorage(STORAGE_KEY, normalizeRecords(records, getDateKey()));
}
```

- [ ] **Step 5: Keep archive entries unique by date**

```js
function dedupeArchive(archive) {
  const seen = new Map();

  archive.forEach((day) => {
    if (day && day.dateKey) {
      seen.set(day.dateKey, day);
    }
  });

  return Array.from(seen.values()).sort((left, right) => (left.dateKey < right.dateKey ? 1 : -1));
}
```

- [ ] **Step 6: Verify the service API still exposes the same public calls**

Run:
```bash
sed -n '1,260p' miniprogram/services/record-service.js
```

Expected:
- `createDayRecord`
- `loadRecords`
- `saveRecords`
- `addSlip`
- `sealToday`
- `unsealToday`
- `getJudgement`

still exist and still work with normalized records.

---

### Task 3: Keep pages thin and let them consume normalized records

**Files:**
- Modify: `miniprogram/pages/today/index.js`
- Modify: `miniprogram/pages/summary/index.js`
- Modify: `miniprogram/pages/archive/index.js`

- [ ] **Step 1: Make the today page rely on normalized `loadRecords()`**

```js
onShow() {
  this.refresh();
},

refresh() {
  const records = loadRecords();
  this.setData({
    records,
    today: records.today,
    judgement: getJudgement(records.today),
    displayDate: formatDisplayDate(records.today.dateKey),
  });
},
```

- [ ] **Step 2: Keep seal / unseal behavior working against the normalized record shape**

```js
seal() {
  const records = this.data.today.sealed
    ? unsealToday(this.data.records)
    : sealToday(this.data.records);

  saveRecords(records);
  this.refresh();

  if (records.today.sealed) {
    wx.navigateTo({ url: "/pages/summary/index" });
    return;
  }

  wx.showToast({ title: "今日已解封", icon: "none" });
},
```

- [ ] **Step 3: Keep summary and archive pages reading from the same local store**

```js
onShow() {
  const records = loadRecords();
  this.setData({
    today: records.today,
    judgement: getJudgement(records.today),
    displayDate: formatDisplayDate(records.today.dateKey),
  });
},
```

```js
onShow() {
  const records = loadRecords();
  const archive = records.archive.map((day) => ({
    ...day,
    displayDate: formatDisplayDate(day.dateKey),
    judgement: getJudgement(day),
  }));

  this.setData({ archive });
},
```

- [ ] **Step 4: Verify page entry points still match app.json**

Run:
```bash
sed -n '1,220p' miniprogram/app.json
```

Expected:
- `pages/today/index`
- `pages/summary/index`
- `pages/archive/index`

are still the only page routes.

---

### Task 4: Verify the local-storage flow end to end in WeChat DevTools

**Files:**
- No code changes expected unless a validation run exposes a real bug

- [ ] **Step 1: Open the project in WeChat DevTools**

Run the import flow from the repository root and confirm the app opens with `miniprogram/` as the app root.

- [ ] **Step 2: Verify first-open behavior**

Expected:
- Today page shows an empty day.
- No login or authorization prompt appears.
- Record buttons are available.

- [ ] **Step 3: Verify a same-day record cycle**

Expected:
- Writing a功 / 写一过 creates local data.
- The box viewer still opens.
- Seal / unseal still works on the same day.

- [ ] **Step 4: Verify date rollover**

Expected:
- If `today.dateKey` is behind the current date, opening the app normalizes the data into `archive`.
- A fresh today record is created automatically.

- [ ] **Step 5: Verify empty and corrupted storage fallback**

Expected:
- Missing storage key falls back to a clean record.
- Invalid storage payload does not crash the page.

- [ ] **Step 6: Record the verification result in the working notes**

Update the implementation notes or session summary with:
- what was verified
- what still needs visual polish
- any remaining manual checks that could not be run here
