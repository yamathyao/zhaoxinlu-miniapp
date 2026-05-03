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
    mode: {
      type: String,
      value: "overlay",
    },
    disabled: {
      type: Boolean,
      value: false,
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
      if (this.properties.mode === "stage") {
        return;
      }
      this.cancel();
    },

    cancel() {
      if (this.properties.disabled) {
        return;
      }
      this.setData({ text: "" });
      this.triggerEvent("cancel");
    },

    submit() {
      if (this.properties.disabled) {
        return;
      }
      this.triggerEvent("submit", {
        text: this.data.text.trim(),
      });
      this.setData({ text: "" });
    },
  },
});