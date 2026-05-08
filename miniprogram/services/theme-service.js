const { getActiveResourceSet } = require("./resource-provider");

function getTheme() {
  return getActiveResourceSet().theme;
}

function getThemeClass() {
  return getTheme().themeClass;
}

function getAsset(slot) {
  const theme = getTheme();
  return theme.assets[slot] || "";
}

module.exports = {
  getTheme,
  getThemeClass,
  getAsset,
};
