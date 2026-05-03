const TOKEN_COPY = {
  gong: {
    title: "写一功",
    placeholder: "今天做对了什么",
    submit: "收入功匣",
    emptySlip: "记一功",
    status: "一枚功符，已收入匣中。",
  },
  guo: {
    title: "写一过",
    placeholder: "哪里想提醒自己",
    submit: "收入过匣",
    emptySlip: "记一过",
    status: "一枚过符，已收入过匣。",
  },
};

const JUDGEMENT_COPY = {
  empty: {
    title: "今日未记",
    copy: "今日尚未收符，且从第一念开始。",
  },
  gong: {
    title: "功多于过",
    copy: "今日有得，赤符稍盛，收下这一点明亮即可。",
  },
  balanced: {
    title: "功过相参",
    copy: "今日有得有失，两匣相对，贵在已经看见。",
  },
  guo: {
    title: "过多于功",
    copy: "今日略有失衡，先收住这一念，明日仍可再正。",
  },
};

module.exports = {
  TOKEN_COPY,
  JUDGEMENT_COPY,
};
