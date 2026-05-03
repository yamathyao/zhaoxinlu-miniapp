const { TOKEN_COPY } = require("../../constants/copy");
const { formatDisplayDate } = require("../../utils/date");
const {
  addSlip,
  getJudgement,
  loadRecords,
  saveRecords,
  sealToday,
} = require("../../services/record-service");

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
      scene: "choosing",
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
      scene: "choosing",
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
        scene: "choosing",
        flyingText: "",
      });
    }, 760);
  },

  seal() {
    const records = sealToday(this.data.records);
    saveRecords(records);
    this.refresh();
    wx.navigateTo({ url: "/pages/summary/index" });
  },

  goSummary() {
    wx.navigateTo({ url: "/pages/summary/index" });
  },

  goArchive() {
    wx.navigateTo({ url: "/pages/archive/index" });
  },
});