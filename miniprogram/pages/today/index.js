const { TOKEN_COPY } = require("../../constants/copy");
const { formatDisplayDate } = require("../../utils/date");
const {
  addSlip,
  getJudgement,
  loadRecords,
  saveRecords,
  sealToday,
  unsealToday,
} = require("../../services/record-service");

const BOX_VIEWER_TITLE = {
  gong: "功匣",
  guo: "过匣",
};

function getSlipText(type, slip) {
  if (slip && slip.text) {
    return slip.text;
  }

  return TOKEN_COPY[type].emptySlip;
}

function buildViewerSlips(type, slips, selectedIndex) {
  const prefix = type === "gong" ? "功符" : "过符";

  return slips.map((slip, index) => ({
    key: `${slip.createdAt || "draft"}-${index}`,
    label: `${prefix}${index + 1}`,
    preview: getSlipText(type, slip).slice(0, 8),
    selected: index === selectedIndex,
  }));
}

Page({
  data: {
    scene: "intro",
    dailyLine: "能看见一念，便已离它近了一步。",
    flyingText: "",
    records: null,
    today: {
      dateKey: "",
      gong: [],
      guo: [],
      sealed: false,
    },
    judgement: {},
    displayDate: "",
    editorVisible: false,
    pendingType: "gong",
    editorCopy: TOKEN_COPY.gong,
    boxViewerVisible: false,
    boxViewerType: "gong",
    boxViewerTitle: "功匣",
    boxViewerSlips: [],
    selectedSlipIndex: 0,
    selectedSlipText: "点选一枚符查看内容",
    hasSelectedSlip: false,
  },

  onShow() {
    this.refresh();
  },

  refresh() {
    const records = loadRecords();
    const judgement = getJudgement(records.today);
    this.setData({
      records,
      today: records.today,
      judgement,
      displayDate: formatDisplayDate(records.today.dateKey),
    });
  },

  enterDesk() {
    this.setData({
      scene: "idle",
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
      wx.showToast({ title: "今日已封存", icon: "none" });
      return;
    }

    this.setData({
      scene: "writing",
      editorVisible: true,
      pendingType: type,
      editorCopy: TOKEN_COPY[type],
    });
  },

  closeEditor() {
    this.setData({
      scene: "idle",
      editorVisible: false,
    });
  },

  submitSlip(event) {
    const type = this.data.pendingType;
    const text = event.detail.text;
    const records = {
      ...this.data.records,
      today: addSlip(this.data.today, type, text),
    };

    this.setData({
      scene: "sending",
      flyingText: text || TOKEN_COPY[type].emptySlip,
      editorVisible: false,
    });

    setTimeout(() => {
      saveRecords(records);
      wx.showToast({ title: TOKEN_COPY[type].status, icon: "none" });
      this.refresh();
      this.setData({
        scene: "idle",
        flyingText: "",
      });
    }, 760);
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

    wx.showToast({ title: "今日已解封", icon: "none" });
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
      boxViewerTitle: BOX_VIEWER_TITLE[type],
      boxViewerSlips: buildViewerSlips(type, slips, selectedIndex),
      selectedSlipIndex: selectedIndex,
      selectedSlipText: slips.length ? getSlipText(type, slips[0]) : "匣中还没有符。",
      hasSelectedSlip: Boolean(slips.length),
    });
  },

  closeBoxViewer() {
    this.setData({
      boxViewerVisible: false,
      boxViewerSlips: [],
      selectedSlipIndex: 0,
      selectedSlipText: "点选一枚符查看内容",
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
      selectedSlipText: slips[index] ? getSlipText(type, slips[index]) : "点选一枚符查看内容",
      hasSelectedSlip: Boolean(slips[index]),
    });
  },

  goSummary() {
    wx.navigateTo({ url: "/pages/summary/index" });
  },

  goArchive() {
    wx.navigateTo({ url: "/pages/archive/index" });
  },
});
