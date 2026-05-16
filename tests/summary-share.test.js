const assert = require("node:assert/strict");

const {
  buildMiniappShareMessage,
  buildMiniappTimelineMessage,
  buildSummaryShareMessage,
} = require("../miniprogram/services/share-service");

function run() {
  assert.deepEqual(buildMiniappShareMessage(), {
    title: "把今日一念，轻轻收进匣中",
    path: "/pages/today/index",
  });
  assert.deepEqual(buildMiniappTimelineMessage(), {
    title: "把今日一念，轻轻收进匣中",
    query: "",
  });

  const message = buildSummaryShareMessage({
    day: {
      dateKey: "2026-05-08",
      gong: [{ text: "早起" }, { text: "整理桌面" }],
      guo: [{ text: "拖延" }],
    },
    judgement: {
      title: "今日有得",
    },
  });

  assert.deepEqual(message, {
    title: "收念匣｜今日有得：2功 1过",
    path: "/pages/today/index",
  });

  const emptyMessage = buildSummaryShareMessage({
    day: {
      dateKey: "2026-05-08",
      gong: [],
      guo: [],
    },
    judgement: {},
  });

  assert.deepEqual(emptyMessage, {
    title: "收念匣｜我收好了今日一念",
    path: "/pages/today/index",
  });
}

run();
