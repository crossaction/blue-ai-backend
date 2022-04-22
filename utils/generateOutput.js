const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const { ignoreList, generateReplaceList, allowedList } = require("../config");

const state = require("../state");

const replaceList = generateReplaceList();

const generateOutput = () => {
  const output = state.wikiLanguages.map((item) => {
    let [key, ...value] = item.trim().split(" ");
    key = key.trim();
    value = value.join(" ").trim();

    if (ignoreList.includes(key)) {
      state.ignoredLanguages.push(key);
      return "";
    }

    if (replaceList.has(key)) {
      key = replaceList.get(key);
    }

    const newLanguage = allowedList.findIndex((item) => item === key);
    if (newLanguage < 0) state.newLanguages.push(key);

    key = `name:${key}`;

    if (value.includes("(")) {
      value = value
        .split(" ")
        .map((val) => {
          const condition =
            `${val}`.trim().startsWith("(") && `${val}`.trim().endsWith(")");
          if (condition) return "";
          return val;
        })
        .filter((val) => val !== "")
        .join(" ");
    }

    const found = state.existingNameTags.findIndex(
      (item) => item.trim().split("=")[0] === key
    );

    if (found !== -1) {
      const [prevKey, prevVal] = state.existingNameTags[found]
        .trim()
        .split("=");
      prevKey.trim();
      prevVal.trim();

      if (prevKey === key.trim() && prevVal === value.trim()) return "";

      state.duplicatingItems.push(`alt_${key}=${value}`);
      return "";
    }

    return `${key}=${value}`;
  });

  const existingAltNames = state.existingNameTags
    .filter((item) => item.includes("alt_name"))
    .map((item) => `${item}`.trim());

  existingAltNames.forEach((itemToCheck) => {
    state.duplicatingItems.forEach((item, i) => {
      let [existingKey, ...existingValue] = item.trim().split("=");
      let [duplicatingKey, ...duplicatingValue] = itemToCheck.trim().split("=");

      existingValue = existingValue[0].trim();
      duplicatingValue = duplicatingValue[0].trim();

      const matchCondition =
        existingKey === duplicatingKey && existingValue === duplicatingValue;

      if (matchCondition) state.duplicatingItems.splice(i, 1);

      const nonMatchCondition =
        existingKey === duplicatingKey && existingValue !== duplicatingValue;

      if (nonMatchCondition) {
        let key = "";
        let [key1, key2] = duplicatingKey.split(":");
        key = `${key1}1:${key2}`;
        state.duplicatingItems.push(`${key}=${duplicatingValue}`);
      }
    });
  });

  if (state.duplicatingItems.length > 0)
    state.duplicatingItems.forEach((item) => output.push(item));

  state.output = output.filter((item) => item !== "").sort();
};

module.exports = generateOutput;
