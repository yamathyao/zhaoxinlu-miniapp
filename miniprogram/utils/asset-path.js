function resolveAssetPath(path) {
  return typeof path === "string" ? path : "";
}

module.exports = {
  resolveAssetPath,
};