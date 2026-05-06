function buildStackSlips(slips) {
  const visibleSlips = Array.isArray(slips) ? slips.slice(-8) : [];

  return visibleSlips.map((slip, index) => ({
    ...slip,
    stackSlot: visibleSlips.length - index,
  }));
}

Component({
  properties: {
    skin: {
      type: Object,
      value: {
        boxBody: "",
        boxLid: "",
      },
    },
    type: {
      type: String,
      value: "gong",
    },
    title: {
      type: String,
      value: "",
    },
    count: {
      type: Number,
      value: 0,
    },
    countUnit: {
      type: String,
      value: "",
    },
    slips: {
      type: Array,
      value: [],
    },
    emptyText: {
      type: String,
      value: "",
    },
    sealed: {
      type: Boolean,
      value: false,
    },
  },

  data: {
    stackSlips: [],
  },

  observers: {
    slips: function(slips) {
      this.setData({
        stackSlips: buildStackSlips(slips),
      });
    },
  },

  lifetimes: {
    attached() {
      this.setData({
        stackSlips: buildStackSlips(this.properties.slips),
      });
    },
  },

  methods: {
    openBox() {
      this.triggerEvent("open", {
        type: this.properties.type,
      });
    },
  },
});
