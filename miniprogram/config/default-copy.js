const DOMAIN_COPY = {
  gong: {
    key: "gong",
    boxTitle: "功匣",
    slipName: "功符",
    writeAction: "写一功",
  },
  guo: {
    key: "guo",
    boxTitle: "过匣",
    slipName: "过符",
    writeAction: "写一过",
  },
};

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

const DEFAULT_COPY = {
  app: {
    name: "收念匣",
    kicker: "双匣试作",
    title: "今日一念，收归两匣",
  },
  intro: {
    kicker: "收念匣",
    line: "能看见一念，便已离它近了一步。",
    hint: "轻触启匣",
  },
  domain: DOMAIN_COPY,
  token: TOKEN_COPY,
  judgement: JUDGEMENT_COPY,
  panel: {
    judgementKicker: "今日评语",
  },
  actionBar: {
    addGong: "写一功",
    addGuo: "写一过",
    summary: "卡片",
    seal: "封存",
    unseal: "解封",
    archive: "归档",
  },
  viewer: {
    countUnit: "符",
    empty: "匣中还没有符。",
    detailTitle: "符文",
    detailPlaceholder: "点选一枚符查看内容",
  },
  paperSlip: {
    cancel: "先不写",
  },
  summary: {
    shareButton: "生成分享样式",
    archiveButton: "查看往日卡片",
    sharePending: "分享卡片样式待打磨",
  },
  archive: {
    kicker: "归档",
    title: "往日卡片",
    empty: "还没有封存的卡片。",
    backToday: "回到今日",
  },
  feedback: {
    todaySealed: "今日已封存",
    todayUnsealed: "今日已解封",
  },
};

module.exports = {
  DEFAULT_COPY,
  DOMAIN_COPY,
  TOKEN_COPY,
  JUDGEMENT_COPY,
};