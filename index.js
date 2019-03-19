"use strict";
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const PORT = process.env.PORT || 3001;
const BASE_URL = process.env.API_URL;
const api_key = process.env.api_key;
const API_OPTIONS = {
  headers: { accept: "application/json" },
  timeout: 3000,
  responseType: "json"
};

const API = axios.create({
  baseURL: "https://api.uptimerobot.com/v2/getMonitors",
});

const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/", function(req, res) {
  API.post(req.body.url, {
          api_key: api_key,
          format: "json",
  })
    .then(response => {
      res.json(response.data);
    })
    .catch(e => {
      console.log(e);
    });

});

app.listen(PORT, function() {
  console.log('proxify is listening on port ', PORT)
});