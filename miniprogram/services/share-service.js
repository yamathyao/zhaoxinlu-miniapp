const SHARE_PATH = "/pages/today/index";

function countSlips(day, type) {
  return Array.isArray(day && day[type]) ? day[type].length : 0;
}

function buildSummaryShareTitle(day, judgement) {
  const title = judgement && judgement.title ? judgement.title : "我收好了今日一念";
  const gongCount = countSlips(day, "gong");
  const guoCount = countSlips(day, "guo");

  if (gongCount === 0 && guoCount === 0) {
    return `收念匣｜${title}`;
  }

  return `收念匣｜${title}：${gongCount}功 ${guoCount}过`;
}

function buildSummaryShareMessage({ day, judgement }) {
  return {
    title: buildSummaryShareTitle(day, judgement),
    path: SHARE_PATH,
  };
}

module.exports = {
  buildSummaryShareMessage,
  buildSummaryShareTitle,
};
