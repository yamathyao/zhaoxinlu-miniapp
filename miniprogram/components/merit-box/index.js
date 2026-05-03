const { TOKEN_COPY } = require("../../constants/copy");

Component({
  properties: {
    type: {
      type: String,
      value: "gong",
    },
    title: {
      type: String,
      value: "功匣",
    },
    count: {
      type: Number,
      value: 0,
    },
    slips: {
      type: Array,
      value: [],
    },
    sealed: {
      type: Boolean,
      value: false,
    },
  },

  data: {
    emptyText: TOKEN_COPY.gong.emptySlip,
  },

  observers: {
    type(type) {
      this.setData({
        emptyText: TOKEN_COPY[type].emptySlip,
      });
    },
  },
});
