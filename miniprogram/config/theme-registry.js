const { buildThemeAssets } = require("./theme-assets");

const THEME_REGISTRY = {
  default: {
    id: "default",
    name: "木匣纸符默认主题",
    themeClass: "theme-default",
    assetsRoot: "/assets/themes/default",
    assets: {},
  },
  "ink-paper": {
    id: "ink-paper",
    name: "水墨纸页主题",
    themeClass: "theme-ink-paper",
    assetsRoot: "/assets/themes/ink-paper",
    assets: buildThemeAssets("/assets/themes/ink-paper")
  }
};

function getRegisteredTheme(themeId) {
  return THEME_REGISTRY[themeId] || THEME_REGISTRY.default;
}

module.exports = {
  THEME_REGISTRY,
  getRegisteredTheme,
};
