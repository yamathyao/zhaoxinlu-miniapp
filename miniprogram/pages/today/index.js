const { formatDisplayDate } = require("../../utils/date");
const {
  getBoxTitle,
  getCopy,
  getSlipName,
  getTokenCopy,
} = require("../../services/copy-service");
const { getTheme } = require("../../services/theme-service");
const {
  addSlip,
  clearAll,
  clearToday,
  getJudgement,
  loadRecords,
  saveRecords,
  sealToday,
  unsealToday,
} = require("../../services/record-service");
const {
  buildMiniappShareMessage,
  buildMiniappTimelineMessage,
  enableMiniappShare,
} = require("../../services/share-service");

const copy = getCopy();
const SLIP_FLY_MS = 760;

function getSlipText(type, slip) {
  if (slip && slip.text) {
    return slip.text;
  }

  return getTokenCopy(type).emptySlip;
}

function buildViewerSlips(type, slips, selectedIndex) {
  const prefix = getSlipName(type);

  return slips.map((slip, index) => ({
    key: `${slip.createdAt || "draft"}-${index}`,
    label: `${prefix}${index + 1}`,
    preview: getSlipText(type, slip).slice(0, 8),
    selected: index === selectedIndex,
  }));
}

function getLampState(day) {
  const gongCount = day.gong.length;
  const guoCount = day.guo.length;
  const balance = gongCount - guoCount;
  const level = getLampLevel(Math.abs(balance));

  if (level === 0) {
    return "lamp-balanced lamp-level-0";
  }

  return `${balance > 0 ? "lamp-bright" : "lamp-dim"} lamp-level-${level}`;
}

function getLampLevel(count) {
  if (count >= 10) {
    return 10;
  }

  if (count >= 5) {
    return 5;
  }

  if (count >= 3) {
    return 3;
  }

  if (count >= 1) {
    return 1;
  }

  return 0;
}

function getFlyingSlipSkin(assets, type) {
  if (!assets) {
    return "";
  }

  return type === "guo"
    ? assets.paperSlipGuo || ""
    : assets.paperSlipGong || "";
}

Page({
  editorOpenTimer: null,
  sendTimer: null,

  data: {
    copy,
    theme: getTheme(),
    scene: "intro",
    dailyLine: copy.intro.line,
    flyingText: "",
    flyingSlipSkin: "",
    records: null,
    today: {
      dateKey: "",
      gong: [],
      guo: [],
      sealed: false,
    },
    judgement: {},
    judgementTone: "empty",
    lampState: "lamp-balanced lamp-level-0",
    displayDate: "",
    editorVisible: false,
    helpVisible: false,
    settingsVisible: false,
    pendingType: "gong",
    editorCopy: getTokenCopy("gong"),
    boxViewerVisible: false,
    boxViewerType: "gong",
    boxViewerTitle: getBoxTitle("gong"),
    boxViewerSlips: [],
    selectedSlipIndex: 0,
    selectedSlipText: copy.viewer.detailPlaceholder,
    hasSelectedSlip: false,
  },

  onLoad() {
    enableMiniappShare();
  },

  onShow() {
    this.refresh();
  },

  onShareAppMessage() {
    return buildMiniappShareMessage();
  },

  onShareTimeline() {
    return buildMiniappTimelineMessage();
  },

  refresh() {
    const records = loadRecords();
    const judgement = getJudgement(records.today);
    this.setData({
      theme: getTheme(),
      records,
      today: records.today,
      judgement,
      judgementTone: this.getJudgementTone(records.today),
      lampState: getLampState(records.today),
      displayDate: formatDisplayDate(records.today.dateKey),
    });
  },

  getJudgementTone(day) {
    const gongCount = day.gong.length;
    const guoCount = day.guo.length;

    if (gongCount === 0 && guoCount === 0) {
      return "empty";
    }

    if (gongCount > guoCount) {
      return "gong";
    }

    if (gongCount < guoCount) {
      return "guo";
    }

    return "balanced";
  },

  enterDesk() {
    this.setData({
      scene: "idle",
    });
  },

  openHelp() {
    this.setData({
      helpVisible: true,
    });
  },

  closeHelp() {
    this.setData({
      helpVisible: false,
    });
  },

  openSettings() {
    this.setData({
      settingsVisible: true,
    });
  },

  closeSettings() {
    this.setData({
      settingsVisible: false,
    });
  },

  confirmClearToday() {
    wx.showModal({
      title: this.data.copy.settings.clearTodayTitle,
      content: this.data.copy.settings.clearTodayConfirm,
      confirmText: this.data.copy.settings.confirm,
      cancelText: this.data.copy.settings.cancel,
      success: ({ confirm }) => {
        if (!confirm) {
          return;
        }

        const records = clearToday(this.data.records || loadRecords());
        saveRecords(records);
        this.refresh();
        this.setData({ settingsVisible: false });
        wx.showToast({ title: this.data.copy.settings.clearTodayDone, icon: "none" });
      },
    });
  },

  confirmClearAll() {
    wx.showModal({
      title: this.data.copy.settings.clearAllTitle,
      content: this.data.copy.settings.clearAllConfirm,
      confirmText: this.data.copy.settings.confirm,
      cancelText: this.data.copy.settings.cancel,
      success: ({ confirm }) => {
        if (!confirm) {
          return;
        }

        const records = clearAll();
        saveRecords(records);
        this.refresh();
        this.setData({ settingsVisible: false });
        wx.showToast({ title: this.data.copy.settings.clearAllDone, icon: "none" });
      },
    });
  },

  openGong() {
    this.openEditor("gong");
  },

  openGuo() {
    this.openEditor("guo");
  },

  openEditor(type) {
    if (this.data.today.sealed) {
      wx.showToast({ title: copy.feedback.todaySealed, icon: "none" });
      return;
    }

    clearTimeout(this.editorOpenTimer);
    clearTimeout(this.sendTimer);
    this.setData({
      scene: "writing",
      editorVisible: true,
      pendingType: type,
      editorCopy: getTokenCopy(type),
    });
  },

  closeEditor() {
    clearTimeout(this.editorOpenTimer);
    this.setData({
      scene: "idle",
      editorVisible: false,
    });
  },

  submitSlip(event) {
    const type = this.data.pendingType;
    const text = event.detail.text;
    const tokenCopy = getTokenCopy(type);
    const records = {
      ...this.data.records,
      today: addSlip(this.data.today, type, text),
    };

    clearTimeout(this.editorOpenTimer);
    clearTimeout(this.sendTimer);
    this.setData({
      scene: "sending",
      flyingText: text || tokenCopy.emptySlip,
      flyingSlipSkin: getFlyingSlipSkin(this.data.theme.assets, type),
      editorVisible: false,
    });

    this.sendTimer = setTimeout(() => {
      saveRecords(records);
      this.refresh();
      this.setData({
        scene: "idle",
        flyingText: "",
        flyingSlipSkin: "",
      });
      wx.showToast({ title: tokenCopy.status, icon: "none" });
    }, SLIP_FLY_MS);
  },

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

    wx.showToast({ title: copy.feedback.todayUnsealed, icon: "none" });
  },

  openBoxViewer(event) {
    if (this.data.editorVisible || this.data.scene === "sending") {
      return;
    }

    const type = event.detail.type === "guo" ? "guo" : "gong";
    const slips = this.data.today[type] || [];
    const selectedIndex = slips.length ? 0 : -1;

    this.setData({
      boxViewerVisible: true,
      boxViewerType: type,
      boxViewerTitle: getBoxTitle(type),
      boxViewerSlips: buildViewerSlips(type, slips, selectedIndex),
      selectedSlipIndex: selectedIndex,
      selectedSlipText: slips.length ? getSlipText(type, slips[0]) : copy.viewer.empty,
      hasSelectedSlip: Boolean(slips.length),
    });
  },

  closeBoxViewer() {
    this.setData({
      boxViewerVisible: false,
      boxViewerSlips: [],
      selectedSlipIndex: 0,
      selectedSlipText: copy.viewer.detailPlaceholder,
      hasSelectedSlip: false,
    });
  },

  noop() {},

  selectSlip(event) {
    const index = Number(event.currentTarget.dataset.index);
    const type = this.data.boxViewerType;
    const slips = this.data.today[type] || [];

    this.setData({
      boxViewerSlips: buildViewerSlips(type, slips, index),
      selectedSlipIndex: index,
      selectedSlipText: slips[index] ? getSlipText(type, slips[index]) : copy.viewer.detailPlaceholder,
      hasSelectedSlip: Boolean(slips[index]),
    });
  },

  goSummary() {
    wx.navigateTo({ url: "/pages/summary/index" });
  },
});
