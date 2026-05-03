const { JUDGEMENT_COPY } = require("../constants/copy");
const { getDateKey } = require("../utils/date");
const { readStorage, writeStorage } = require("../utils/storage");

const STORAGE_KEY = "shounian-box.records.v1";

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

function createArchiveEntry(today) {
  return {
    ...today,
    sealed: true,
    sealedAt: Date.now(),
  };
}

function upsertArchive(archive, entry) {
  const exists = archive.some((day) => day.dateKey === entry.dateKey);
  if (!exists) {
    return [entry, ...archive];
  }

  return archive.map((day) => (day.dateKey === entry.dateKey ? entry : day));
}

function sealToday(records) {
  const sealedToday = {
    ...records.today,
    sealed: true,
  };
  const archiveEntry = createArchiveEntry(sealedToday);

  return {
    today: sealedToday,
    archive: upsertArchive(records.archive, archiveEntry),
  };
}

function unsealToday(records) {
  return {
    ...records,
    today: {
      ...records.today,
      sealed: false,
    },
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
  unsealToday,
  getJudgement,
};
