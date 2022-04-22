const state = require("../state");

const resetState = () => {
  state.feature = "";
  state.wikiItemId = "";
  state.wikiItemsFound = "";
  state.existingNameTags = [];
  state.wikiLanguages = [];
  state.duplicatingItems = [];
  state.excludedWikiItems = [];
  state.newLanguages = [];
  state.ignoredLanguages = [];
  state.output = [];
  state.manualInput = [];
};

module.exports = resetState;
