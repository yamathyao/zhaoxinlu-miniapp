const { getCopy } = require("../../services/copy-service");
const { getTheme } = require("../../services/theme-service");
const { formatDisplayDate } = require("../../utils/date");
const { getJudgement, loadRecords } = require("../../services/record-service");
const {
  buildMiniappShareMessage,
  buildMiniappTimelineMessage,
  buildSummaryShareMessage,
  enableMiniappShare,
} = require("../../services/share-service");

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

  onLoad() {
    enableMiniappShare();
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

  onShareAppMessage(event) {
    if (!event || event.from !== "button") {
      return buildMiniappShareMessage();
    }

    return buildSummaryShareMessage({
      day: this.data.today,
      judgement: this.data.judgement,
    });
  },

  onShareTimeline() {
    return buildMiniappTimelineMessage();
  },

  goArchive() {
    wx.navigateTo({ url: "/pages/archive/index" });
  },
});
