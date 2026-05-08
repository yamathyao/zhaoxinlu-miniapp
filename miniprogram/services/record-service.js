const { JUDGEMENT_COPY } = require("../constants/copy");
const {
  getDateKey,
  isAfterDateKey,
  isBeforeDateKey,
} = require("../utils/date");
const { readStorage, writeStorage } = require("../utils/storage");

const STORAGE_KEY = "shounian-box.records.v1";

function createDayRecord(dateKey = getDateKey()) {
  return {
    dateKey,
    gong: [],
    guo: [],
    sealed: false,
    sealedAt: null,
  };
}

function createEmptyRecords(dateKey = getDateKey()) {
  return {
    version: 1,
    today: createDayRecord(dateKey),
    archive: [],
  };
}

function normalizeSlip(slip) {
  const source = slip && typeof slip === "object" ? slip : {};

  return {
    text: typeof source.text === "string" ? source.text : "",
    createdAt: typeof source.createdAt === "number" ? source.createdAt : Date.now(),
  };
}

function normalizeDay(day, dateKey) {
  const source = day && typeof day === "object" ? day : {};

  return {
    dateKey: typeof source.dateKey === "string" ? source.dateKey : dateKey,
    gong: Array.isArray(source.gong) ? source.gong.map(normalizeSlip) : [],
    guo: Array.isArray(source.guo) ? source.guo.map(normalizeSlip) : [],
    sealed: Boolean(source.sealed),
    sealedAt: typeof source.sealedAt === "number" ? source.sealedAt : null,
  };
}

function dedupeArchive(archive) {
  const seen = new Map();

  archive.forEach((day) => {
    if (day && day.dateKey) {
      seen.set(day.dateKey, day);
    }
  });

  return Array.from(seen.values()).sort((left, right) => {
    if (left.dateKey === right.dateKey) {
      return 0;
    }

    return left.dateKey < right.dateKey ? 1 : -1;
  });
}

function loadRecords() {
  const rawRecords = readStorage(STORAGE_KEY, null);
  const todayKey = getDateKey();

  if (!rawRecords || typeof rawRecords !== "object") {
    const records = createEmptyRecords(todayKey);
    writeStorage(STORAGE_KEY, records);
    return records;
  }

  const today = normalizeDay(rawRecords.today, todayKey);
  const archive = Array.isArray(rawRecords.archive)
    ? rawRecords.archive.map((day) => normalizeDay(day, day && day.dateKey ? day.dateKey : todayKey))
    : [];

  const records = {
    version: 1,
    today,
    archive,
  };

  if (isBeforeDateKey(records.today.dateKey, todayKey)) {
    if (records.today.gong.length > 0 || records.today.guo.length > 0) {
      records.archive = upsertArchive(
        records.archive,
        createArchiveEntry({
          ...records.today,
          sealed: true,
        }),
      );
    }

    records.today = createDayRecord(todayKey);
  } else if (isAfterDateKey(records.today.dateKey, todayKey)) {
    records.today = createDayRecord(todayKey);
  }

  records.archive = dedupeArchive(records.archive);
  writeStorage(STORAGE_KEY, records);

  return records;
}

function saveRecords(records) {
  writeStorage(STORAGE_KEY, {
    version: 1,
    today: normalizeDay(records.today, getDateKey()),
    archive: dedupeArchive(
      Array.isArray(records.archive)
        ? records.archive.map((day) => normalizeDay(day, day && day.dateKey ? day.dateKey : getDateKey()))
        : [],
    ),
  });
}

function addSlip(day, type, text) {
  const source = normalizeDay(day, getDateKey());

  return {
    ...source,
    [type]: [
      ...source[type],
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
    sealedAt: typeof today.sealedAt === "number" ? today.sealedAt : Date.now(),
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
    sealedAt: Date.now(),
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
      sealedAt: null,
    },
  };
}

function clearToday(records) {
  const todayKey = getDateKey();

  return {
    ...records,
    today: createDayRecord(todayKey),
    archive: (records.archive || []).filter((day) => day.dateKey !== todayKey),
  };
}

function clearAll() {
  return createEmptyRecords(getDateKey());
}

function getJudgementTone(day) {
  const gongCount = day.gong.length;
  const guoCount = day.guo.length;
  const diff = gongCount - guoCount;

  if (gongCount === 0 && guoCount === 0) {
    return "empty";
  }

  if (diff > 0) {
    return "gong";
  }

  if (diff < 0) {
    return "guo";
  }

  return "balanced";
}

function hashSeed(text) {
  return String(text).split("").reduce((acc, char) => {
    return (acc * 131 + char.charCodeAt(0)) % 2147483647;
  }, 7);
}

function pickFromPool(pool, seed) {
  if (!Array.isArray(pool) || !pool.length) {
    return "";
  }

  return pool[seed % pool.length];
}

function getJudgement(day) {
  const tone = getJudgementTone(day);
  const source = JUDGEMENT_COPY[tone] || JUDGEMENT_COPY.empty;
  const dateKey = day && day.dateKey ? day.dateKey : getDateKey();
  const gongCount = Array.isArray(day && day.gong) ? day.gong.length : 0;
  const guoCount = Array.isArray(day && day.guo) ? day.guo.length : 0;
  const titleSeed = hashSeed(`${dateKey}|${tone}|${gongCount}|${guoCount}|title`);
  const copySeed = hashSeed(`${dateKey}|${tone}|${gongCount}|${guoCount}|copy`);

  return {
    tone,
    title: pickFromPool(source.titlePool, titleSeed),
    copy: pickFromPool(source.copyPool, copySeed),
  };
}

module.exports = {
  createDayRecord,
  createEmptyRecords,
  normalizeSlip,
  normalizeDay,
  dedupeArchive,
  loadRecords,
  saveRecords,
  addSlip,
  createArchiveEntry,
  upsertArchive,
  sealToday,
  unsealToday,
  clearToday,
  clearAll,
  getJudgementTone,
  getJudgement,
};
