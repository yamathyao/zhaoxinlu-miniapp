const { formatDisplayDate } = require("../../utils/date");
const { getJudgement, loadRecords } = require("../../services/record-service");

Page({
  data: {
    archive: [],
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
});
