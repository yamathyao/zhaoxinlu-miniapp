Component({
  properties: {
    visible: {
      type: Boolean,
      value: false,
    },
    type: {
      type: String,
      value: "gong",
    },
    title: {
      type: String,
      value: "写一功",
    },
    placeholder: {
      type: String,
      value: "",
    },
    submitText: {
      type: String,
      value: "收入功匣",
    },
  },

  data: {
    text: "",
  },

  methods: {
    noop() {},

    handleInput(event) {
      this.setData({
        text: event.detail.value,
      });
    },

    handleMaskTap() {
      this.cancel();
    },

    cancel() {
      this.setData({ text: "" });
      this.triggerEvent("cancel");
    },

    submit() {
      this.triggerEvent("submit", {
        text: this.data.text.trim(),
      });
      this.setData({ text: "" });
    },
  },
});
