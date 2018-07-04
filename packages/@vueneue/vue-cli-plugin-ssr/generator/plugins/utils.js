const getFilePath = (api, filepath) => {
  if (api.hasPlugin('typescript')) {
    return `${filepath}.ts`;
  }
  return `${filepath}.js`;
};

module.exports = {
  getFilePath,
};
