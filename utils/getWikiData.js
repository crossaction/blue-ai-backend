const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const state = require("../state");

const getWikiData = async () => {
  try {
    if (state.wikiItemId === "" || state.wikiItemId === undefined)
      throw new Error(`Feature doesn't have wiki item tag`);

    const url = `https://www.wikidata.org/wiki/Special:EntityData/${state.wikiItemId}.json`;
    const request = await fetch(url);

    if (request.status !== 200) throw new Error("Failed to fetch wikidata");

    const response = await request.json();
    const data = response.entities[`${state.wikiItemId}`.trim()].sitelinks;

    state.wikiItemsFound = Object.keys(data).length;

    const wikiLanguages = Object.entries(data).map((item) => {
      const [language, value] = [item[1].site.trim(), item[1].title.trim()];

      const condition =
        language.slice(language.length - 4, language.length) === "wiki";

      if (condition) return `${language.slice(0, -4)} ${value}`;
      state.excludedWikiItems.push(`${language} ${value}`);
      return "";
    });

    state.wikiLanguages = wikiLanguages.filter((item) => item !== "");
  } catch (err) {
    throw err;
  }
};

module.exports = getWikiData;
