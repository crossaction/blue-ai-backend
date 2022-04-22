const express = require("express");
const app = express();
const dotenv = require("dotenv").config({ path: "./config.env" });
const port = process.env.port || 3000;

const state = require("./state");
const resetState = require("./utils/resetState");
const processFeature = require("./utils/processFeature");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/api/v1/", (req, res) => {
  res.status(200).json({ status: "Success", message: "Welcome to the API" });
});

app.get("/api/v1/:type/:id", async (req, res) => {
  try {
    const { type, id } = req.params;

    if (type === "" || id === "") {
      return res.send(404).json({
        status: "Invalid Input",
        message: "Please provide a valid feature Type & ID",
      });
    }

    state.feature = `${type.trim()}/${+id}`;

    await processFeature();

    res.status(200).json({
      status: "Success",
      state,
    });

    resetState();
  } catch (e) {
    res.status(404).json({ status: "Failed", message: e.message, results: [] });
  }
});

app.get("*", (req, res) => {
  res.status(404).json({ status: "Error", message: "Page not found" });
});

app.listen(port, () => {
  console.log(`Server started running`);
});
