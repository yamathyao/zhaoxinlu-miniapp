Component({
  properties: {
    skin: {
      type: Object,
      value: {},
    },
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
      value: "",
    },
    placeholder: {
      type: String,
      value: "",
    },
    submitText: {
      type: String,
      value: "",
    },
    cancelText: {
      type: String,
      value: "",
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
    paperSkin: "",
    paperOffsetY: 0,
  },

  observers: {
    "skin,type": function(skin, type) {
      const typedSkin = type === "guo"
        ? skin.paperSlipGuo
        : skin.paperSlipGong;

      this.setData({
        paperSkin: skin.paperSlipEditor || typedSkin || "",
      });
    },
    visible: function(visible) {
      if (!visible) {
        this.setData({
          paperOffsetY: 0,
        });
      }
    },
  },

  methods: {
    noop() {},

    pxToRpx(px) {
      const systemInfo = wx.getWindowInfo
        ? wx.getWindowInfo()
        : wx.getSystemInfoSync();
      const windowWidth = systemInfo.windowWidth || 375;

      return px * 750 / windowWidth;
    },

    getKeyboardOffset(heightPx) {
      if (!heightPx) {
        return 0;
      }

      const keyboardHeightRpx = this.pxToRpx(heightPx);
      return Math.max(0, Math.min(420, keyboardHeightRpx - 40));
    },

    handleInput(event) {
      this.setData({
        text: event.detail.value,
      });
    },

    handleFocus(event) {
      const height = event.detail && typeof event.detail.height === "number"
        ? event.detail.height
        : 0;

      this.setData({
        paperOffsetY: this.getKeyboardOffset(height),
      });
    },

    handleBlur() {
      this.setData({
        paperOffsetY: 0,
      });
    },

    handleKeyboardHeightChange(event) {
      const height = event.detail && typeof event.detail.height === "number"
        ? event.detail.height
        : 0;

      this.setData({
        paperOffsetY: this.getKeyboardOffset(height),
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
      this.setData({ text: "", paperOffsetY: 0 });
      this.triggerEvent("cancel");
    },

    submit() {
      if (this.properties.disabled) {
        return;
      }
      this.triggerEvent("submit", {
        text: this.data.text.trim(),
      });
      this.setData({ text: "", paperOffsetY: 0 });
    },
  },
});
