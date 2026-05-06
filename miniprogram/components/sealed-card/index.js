Component({
  properties: {
    day: {
      type: Object,
      value: {
        gong: [],
        guo: [],
      },
    },
    judgement: {
      type: Object,
      value: {},
    },
    displayDate: {
      type: String,
      value: "",
    },
    copy: {
      type: Object,
      value: {
        domain: {
          gong: { slipName: "" },
          guo: { slipName: "" },
        },
      },
    },
  },
});