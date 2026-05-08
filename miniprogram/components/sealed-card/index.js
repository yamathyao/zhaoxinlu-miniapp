function getLampState(day) {
  const gongCount = (day.gong || []).length;
  const guoCount = (day.guo || []).length;
  const balance = gongCount - guoCount;
  const level = getLampLevel(Math.abs(balance));

  if (level === 0) {
    return "lamp-balanced lamp-level-0";
  }

  return `${balance > 0 ? "lamp-bright" : "lamp-dim"} lamp-level-${level}`;
}

function getLampLevel(count) {
  if (count >= 10) {
    return 10;
  }

  if (count >= 5) {
    return 5;
  }

  if (count >= 3) {
    return 3;
  }

  if (count >= 1) {
    return 1;
  }

  return 0;
}

Component({
  data: {
    lampState: "lamp-balanced lamp-level-0",
  },

  properties: {
    skin: {
      type: Object,
      value: {
        cardBg: "",
        heartLamp: "",
      },
    },
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

  observers: {
    day: function(day) {
      this.setData({
        lampState: getLampState(day || {}),
      });
    },
  },

  lifetimes: {
    attached() {
      this.setData({
        lampState: getLampState(this.properties.day || {}),
      });
    },
  },
});
