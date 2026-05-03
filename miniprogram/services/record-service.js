const { JUDGEMENT_COPY } = require("../constants/copy");
const { getDateKey } = require("../utils/date");
const { readStorage, writeStorage } = require("../utils/storage");

const STORAGE_KEY = "zhaoxinlu.records.v1";

function createDayRecord(dateKey = getDateKey()) {
  return {
    dateKey,
    gong: [],
    guo: [],
    sealed: false,
  };
}

function loadRecords() {
  return readStorage(STORAGE_KEY, {
    today: createDayRecord(),
    archive: [],
  });
}

function saveRecords(records) {
  writeStorage(STORAGE_KEY, records);
}

function addSlip(day, type, text) {
  return {
    ...day,
    [type]: [
      ...day[type],
      {
        text: text || "",
        createdAt: Date.now(),
      },
    ],
  };
}

function sealToday(records) {
  if (records.today.sealed) {
    return records;
  }

  return {
    today: {
      ...records.today,
      sealed: true,
    },
    archive: [
      {
        ...records.today,
        sealed: true,
        sealedAt: Date.now(),
      },
      ...records.archive,
    ],
  };
}

function getJudgement(day) {
  const gongCount = day.gong.length;
  const guoCount = day.guo.length;
  const diff = gongCount - guoCount;

  if (gongCount === 0 && guoCount === 0) {
    return JUDGEMENT_COPY.empty;
  }

  if (diff > 0) {
    return JUDGEMENT_COPY.gong;
  }

  if (diff < 0) {
    return JUDGEMENT_COPY.guo;
  }

  return JUDGEMENT_COPY.balanced;
}

module.exports = {
  createDayRecord,
  loadRecords,
  saveRecords,
  addSlip,
  sealToday,
  getJudgement,
};
