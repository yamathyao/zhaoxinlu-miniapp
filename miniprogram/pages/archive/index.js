const { getCopy } = require("../../services/copy-service");
const { formatDisplayDate } = require("../../utils/date");
const { getJudgement, loadRecords } = require("../../services/record-service");
const {
  buildMiniappShareMessage,
  buildMiniappTimelineMessage,
  enableMiniappShare,
} = require("../../services/share-service");

const copy = getCopy();

Page({
  data: {
    copy,
    archive: [],
  },

  onLoad() {
    enableMiniappShare();
  },

  onShow() {
    const records = loadRecords();
    const archive = records.archive.map((day) => ({
      ...day,
      displayDate: formatDisplayDate(day.dateKey),
      judgement: getJudgement(day),
    }));

    this.setData({ archive });
  },

  goToday() {
    wx.navigateBack();
  },

  onShareAppMessage() {
    return buildMiniappShareMessage();
  },

  onShareTimeline() {
    return buildMiniappTimelineMessage();
  },
});
