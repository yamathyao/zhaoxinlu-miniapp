const { formatDisplayDate } = require("../../utils/date");
const {
  getBoxTitle,
  getCopy,
  getSlipName,
  getTokenCopy,
} = require("../../services/copy-service");
const {
  addSlip,
  getJudgement,
  loadRecords,
  saveRecords,
  sealToday,
  unsealToday,
} = require("../../services/record-service");

const copy = getCopy();

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

Page({
  data: {
    copy,
    scene: "intro",
    dailyLine: copy.intro.line,
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
    editorCopy: getTokenCopy("gong"),
    boxViewerVisible: false,
    boxViewerType: "gong",
    boxViewerTitle: getBoxTitle("gong"),
    boxViewerSlips: [],
    selectedSlipIndex: 0,
    selectedSlipText: copy.viewer.detailPlaceholder,
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
      wx.showToast({ title: copy.feedback.todaySealed, icon: "none" });
      return;
    }

    this.setData({
      scene: "writing",
      editorVisible: true,
      pendingType: type,
      editorCopy: getTokenCopy(type),
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
    const tokenCopy = getTokenCopy(type);
    const records = {
      ...this.data.records,
      today: addSlip(this.data.today, type, text),
    };

    this.setData({
      scene: "sending",
      flyingText: text || tokenCopy.emptySlip,
      editorVisible: false,
    });

    setTimeout(() => {
      saveRecords(records);
      wx.showToast({ title: tokenCopy.status, icon: "none" });
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

  goArchive() {
    wx.navigateTo({ url: "/pages/archive/index" });
  },
});