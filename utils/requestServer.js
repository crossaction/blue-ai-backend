const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const state = require("../state");

const requestServer = async () => {
  try {
    const url = `https://api.openstreetmap.org/api/0.6/${state.feature}.json`;
    const request = await fetch(url);

    if (request.status !== 200)
      throw new Error("Failed to fetch existing tags");

    const response = await request.json();
    const tags = response.elements[0].tags;
    const existingNameTags = Object.entries(tags)
      .map((tag) => `${tag[0]}=${tag[1]}`)
      .filter((tag) => `${tag}`.toLowerCase().includes("name:"));

    state.existingNameTags = existingNameTags;
    state.wikiItemId = tags.wikidata;
  } catch (e) {
    throw e;
  }
};

module.exports = requestServer;
