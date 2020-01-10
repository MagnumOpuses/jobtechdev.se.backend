"use strict";
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const PORT = process.env.PORT || 8080;
const BASE_URL = process.env.API_URL;
const api_key = process.env.api_key;
const client_id = process.env.client_id;
const client_secret = process.env.client_secret;
const API_OPTIONS = {
  headers: { accept: "application/json" },
  timeout: 3000,
  responseType: "json"
};
const fs = require('fs');
var url = require('url');
var mcache = require('memory-cache')



const app = express();


var cache = (duration) => {
    return (req, res, next) => {
        let key = '__express__' + req.originalUrl || req.url
        let cachedBody = mcache.get(key)
        if (cachedBody) {
            res.send(cachedBody)
            return
        } else {
            res.sendResponse = res.send
            res.send = (body) => {
                mcache.put(key, body, duration * 1000);
                res.sendResponse(body)
            }
            next()
        }
    }
}

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



app.get('/git/*',cache(6000), function(req, res) {

    var url_parts = url.parse(req.url, true);


    var API = axios.create({
        baseURL: "https://api.github.com"+url_parts.path.replace("/git","")+"&client_id=4468ae21ec651cb786c2&client_secret=cf1ac73cf6079b88322a278bbce566a9bf5cc18b"

    });
    fs.appendFile('url.txt', '\n https://api.github.com'+url_parts.path.replace("/git",""), function (err) {
        if (err) throw err;
        console.log('Saved!');
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
app.listen(PORT, function() {
  console.log('proxify is listening on port ', PORT)
});