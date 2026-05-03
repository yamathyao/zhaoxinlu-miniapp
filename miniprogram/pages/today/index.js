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
      editorVisible: true,
      pendingType: type,
      editorCopy: TOKEN_COPY[type],
    });
  },

  closeEditor() {
    this.setData({
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

    saveRecords(records);
    this.setData({
      editorVisible: false,
    });
    wx.showToast({ title: TOKEN_COPY[type].status, icon: "none" });
    this.refresh();
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
