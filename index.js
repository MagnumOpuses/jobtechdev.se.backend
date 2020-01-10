"use strict";
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const PORT = process.env.PORT || 3001;
const BASE_URL = process.env.API_URL;
const api_key = process.env.api_key;
const client_id = process.env.client_id;
const client_secret = process.env.client_secret;
const API_OPTIONS = {
  headers: { accept: "application/json" },
  timeout: 3000,
  responseType: "json"
};
var url = require('url');



const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://jobtechdev.se");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.get('/git/*', function(req, res) {

    var url_parts = url.parse(req.url, true);
    const api_keyj = process.env.api_key;

    var API = axios.create({
        baseURL: "https://api.github.com"+url_parts.path.replace("/git","")+"&client_id=4468ae21ec651cb786c2&client_secret=cf1ac73cf6079b88322a278bbce566a9bf5cc18b"

    });
    API.get(req.body.url, {

    })
        .then(response => {
            res.json(response.data);

        })
        .catch(e => {
            console.log(e);
        });
});

/*
app.get("/jobsearch/!*", function(req, res) {

    var url_parts = url.parse(req.url, true);
    const api_keyj = process.env.api_key;

    var API = axios.create({
        baseURL: "https://jobsearch.api.jobtechdev.se/"+url_parts.path.replace("/jobsearch",""),
        headers: {'api-key': api_key},
    });
  API.get(req.body.url, {

  })
    .then(response => {
      res.json(response.data);

    })
    .catch(e => {
      console.log(e);
    });
});

app.get("/yrkesinfo/!*", function(req, res) {
    const api_keyj = process.env.api_key;
    var url_parts = url.parse(req.url, true);
    var API = axios.create({
        baseURL: "https://apier.arbetsformedlingen.se"+url_parts.path.replace("/yrkesinfo",""),
        params:{
            client_id: client_id,
            client_secret: client_secret,
        }
    });

    API.get(req.body.url, {
        format: "json",
    })
        .then(response => {
            res.json(response.data);

        })
        .catch(e => {
            console.log(e);
        });

});
*/
app.listen(PORT, "localhost", function() {
  console.log('proxify is listening on port ', PORT)
});