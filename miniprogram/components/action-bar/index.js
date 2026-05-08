Component({
  properties: {
    sealed: {
      type: Boolean,
      value: false,
    },
    copy: {
      type: Object,
      value: {
        addGong: "",
        addGuo: "",
        summary: "",
        seal: "",
        unseal: "",
      },
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
  },
});
