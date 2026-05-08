const {
  DEFAULT_COPY,
  DOMAIN_COPY,
  TOKEN_COPY,
  JUDGEMENT_COPY,
} = require("../config/default-copy");

function getCopy() {
  return DEFAULT_COPY;
}

function getDomainCopy(type) {
  return DOMAIN_COPY[type] || DOMAIN_COPY.gong;
}

function getTokenCopy(type) {
  return TOKEN_COPY[type] || TOKEN_COPY.gong;
}

function getJudgementCopy(key) {
  return JUDGEMENT_COPY[key] || JUDGEMENT_COPY.empty;
}

function getBoxTitle(type) {
  return getDomainCopy(type).boxTitle;
}

function getSlipName(type) {
  return getDomainCopy(type).slipName;
}

module.exports = {
  getCopy,
  getDomainCopy,
  getTokenCopy,
  getJudgementCopy,
  getBoxTitle,
  getSlipName,
};