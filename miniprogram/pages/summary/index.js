const { formatDisplayDate } = require("../../utils/date");
const { getJudgement, loadRecords } = require("../../services/record-service");

Page({
  data: {
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
    wx.showToast({ title: "分享卡片样式待打磨", icon: "none" });
  },

  goArchive() {
    wx.navigateTo({ url: "/pages/archive/index" });
  },
});
