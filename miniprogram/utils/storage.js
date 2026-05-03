function readStorage(key, fallback) {
  try {
    const value = wx.getStorageSync(key);
    return value || fallback;
  } catch (error) {
    return fallback;
  }
}

function writeStorage(key, value) {
  wx.setStorageSync(key, value);
}

module.exports = {
  readStorage,
  writeStorage,
};
