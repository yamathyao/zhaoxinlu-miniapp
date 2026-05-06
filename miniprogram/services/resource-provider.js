const { DEFAULT_COPY } = require("../config/default-copy");
const { DEFAULT_THEME } = require("../config/default-theme");

function getActiveResourceSet() {
  return {
    copy: DEFAULT_COPY,
    theme: DEFAULT_THEME,
    source: "bundled-default",
  };
}

module.exports = {
  getActiveResourceSet,
};