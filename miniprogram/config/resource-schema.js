const RESOURCE_SCHEMA = {
  id: "string",
  version: "string",
  copy: "object",
  theme: "object",
  assets: "object",
};

const RESOURCE_BOUNDARY = {
  allowed: ["copy", "theme", "assets"],
  forbidden: ["js", "wxml", "wxss", "routes", "storage", "logic"],
};

module.exports = {
  RESOURCE_SCHEMA,
  RESOURCE_BOUNDARY,
};