const STANDARD_THEME_ASSET_FILES = {
  bgPaper: "bg-paper.png",
  deskSurface: "desk-surface.png",
  boxGongBody: "box-gong-body.png",
  boxGongLid: "box-gong-lid.png",
  boxGuoBody: "box-guo-body.png",
  boxGuoLid: "box-guo-lid.png",
  paperSlipGong: "paper-slip-gong.png",
  paperSlipGuo: "paper-slip-guo.png",
  paperSlipEditor: "paper-slip-editor.png",
  cardBg: "card-bg.png",
  sealIcon: "seal.png",
  sealRibbon: "seal-ribbon.png",
  heartLamp: "heart-lamp.png",
  dustMotes: "dust-motes.png",
};

function buildThemeAssets(root) {
  return Object.keys(STANDARD_THEME_ASSET_FILES).reduce((assets, slot) => {
    assets[slot] = `${root}/${STANDARD_THEME_ASSET_FILES[slot]}`;
    return assets;
  }, {});
}

module.exports = {
  STANDARD_THEME_ASSET_FILES,
  buildThemeAssets,
};
