const getWikiData = require("./getWikiData");
const requestServer = require("./requestServer");
const generateOutput = require("./generateOutput");

const { state, initialState } = require("../state");

const processFeature = async () => {
  try {
    await requestServer();
    await getWikiData();
    return generateOutput();
  } catch (e) {
    throw e;
  }
};

module.exports = processFeature;
