const { getCopy } = require("../../services/copy-service");
const { getTheme } = require("../../services/theme-service");
const { formatDisplayDate } = require("../../utils/date");
const { getJudgement, loadRecords } = require("../../services/record-service");
const { buildSummaryShareMessage } = require("../../services/share-service");

const copy = getCopy();

Page({
  data: {
    copy,
    theme: getTheme(),
    today: {
      dateKey: "",
      gong: [],
      guo: [],
      sealed: false,
    },
    judgement: {},
    displayDate: "",
  },

  onShow() {
    const records = loadRecords();
    this.setData({
      theme: getTheme(),
      today: records.today,
      judgement: getJudgement(records.today),
      displayDate: formatDisplayDate(records.today.dateKey),
    });
  },

  onShareAppMessage() {
    return buildSummaryShareMessage({
      day: this.data.today,
      judgement: this.data.judgement,
    });
  },

  goArchive() {
    wx.navigateTo({ url: "/pages/archive/index" });
  },
});
