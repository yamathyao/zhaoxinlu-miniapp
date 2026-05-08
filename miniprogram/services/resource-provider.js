const { DEFAULT_COPY } = require("../config/default-copy");
const { ACTIVE_THEME_ID } = require("../config/active-theme");
const { DEFAULT_THEME } = require("../config/default-theme");
const { getRegisteredTheme } = require("../config/theme-registry");

function mergeTheme(baseTheme, activeTheme) {
  return {
    ...baseTheme,
    ...activeTheme,
    tokens: {
      ...baseTheme.tokens,
      ...(activeTheme.tokens || {}),
    },
    assets: {
      ...baseTheme.assets,
      ...(activeTheme.assets || {}),
    },
  };
}

function getActiveResourceSet() {
  const activeTheme = getRegisteredTheme(ACTIVE_THEME_ID);

  return {
    copy: DEFAULT_COPY,
    theme: mergeTheme(DEFAULT_THEME, activeTheme),
    source: activeTheme.id === DEFAULT_THEME.id ? "bundled-default" : "bundled-theme",
  };
}

module.exports = {
  mergeTheme,
  getActiveResourceSet,
};
