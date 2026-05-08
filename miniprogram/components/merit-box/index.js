function buildStackSlips(slips) {
  const visibleSlips = Array.isArray(slips) ? slips.slice(-8) : [];

  return visibleSlips.map((slip, index) => ({
    ...slip,
    stackSlot: visibleSlips.length - index,
  }));
}

function getTypedAsset(skin, type, suffix, fallback) {
  if (!skin) {
    return "";
  }

  const typeName = type === "guo" ? "Guo" : "Gong";
  return skin[`box${typeName}${suffix}`] || skin[fallback] || "";
}

function getSlipAsset(skin, type) {
  if (!skin) {
    return "";
  }

  return type === "guo"
    ? skin.paperSlipGuo || ""
    : skin.paperSlipGong || "";
}

function buildVisualSkin(skin, type) {
  return {
    body: getTypedAsset(skin, type, "Body", "boxBody"),
    lid: getTypedAsset(skin, type, "Lid", "boxLid"),
    slip: getSlipAsset(skin, type),
  };
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
    visualSkin: {},
  },

  observers: {
    slips: function(slips) {
      this.setData({
        stackSlips: buildStackSlips(slips),
      });
    },
    "skin,type": function(skin, type) {
      this.setData({
        visualSkin: buildVisualSkin(skin, type),
      });
    },
  },

  lifetimes: {
    attached() {
      this.setData({
        stackSlips: buildStackSlips(this.properties.slips),
        visualSkin: buildVisualSkin(this.properties.skin, this.properties.type),
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
