const { getCopy } = require("../../services/copy-service");
const { formatDisplayDate } = require("../../utils/date");
const { getJudgement, loadRecords } = require("../../services/record-service");

const copy = getCopy();

Page({
  data: {
    copy,
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