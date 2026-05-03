Component({
  properties: {
    sealed: {
      type: Boolean,
      value: false,
    },
  },

  methods: {
    addGong() {
      this.triggerEvent("addgong");
    },

    addGuo() {
      this.triggerEvent("addguo");
    },

    summary() {
      this.triggerEvent("summary");
    },

    seal() {
      this.triggerEvent("seal");
    },

    archive() {
      this.triggerEvent("archive");
    },
  },
});
