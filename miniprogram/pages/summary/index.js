const { getCopy } = require("../../services/copy-service");
const { formatDisplayDate } = require("../../utils/date");
const { getJudgement, loadRecords } = require("../../services/record-service");

const copy = getCopy();

Page({
  data: {
    copy,
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
      today: records.today,
      judgement: getJudgement(records.today),
      displayDate: formatDisplayDate(records.today.dateKey),
    });
  },

  shareCard() {
    wx.showToast({ title: copy.summary.sharePending, icon: "none" });
  },

  goArchive() {
    wx.navigateTo({ url: "/pages/archive/index" });
  },
});