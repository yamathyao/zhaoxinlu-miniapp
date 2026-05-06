Component({
  properties: {
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

  methods: {
    openBox() {
      this.triggerEvent("open", {
        type: this.properties.type,
      });
    },
  },
});