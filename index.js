"use strict";
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const nodemailer = require("nodemailer");

const PORT = process.env.PORT || 8080;
const BASE_URL = process.env.API_URL;
const api_key = process.env.api_key;
const mailUser = process.env.mailuser;
const mailPassword = process.env.mailpassword;
const clientIdGitlab = process.env.client_id_gitlab;
const apiKeyGitlab = process.env.client_secret_gitlab;
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
    "Origin, X-Requested-With, Content-Type, Accept",
  );
    res.header("cache-control", "public, max-age=6000");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.get('/api/github/*',cache(6000), function(req, res) {

    var url_parts = url.parse(req.url, true);


    var API = axios.create({
        baseURL: "https://api.github.com"+url_parts.path.replace("/api/github","")+"&client_id="+client_id+"&client_secret="+client_secret

    });
    fs.appendFile('url.txt', '\n https://api.github.com'+url_parts.path.replace("/api/github",""), function (err) {
        if (err) throw err;
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
app.get('/api/gitlab/*',cache(6000), function(req, res) {
    var url_parts = url.parse(req.url, true);
    var API = axios.create({
        baseURL: "https://gitlab.com"+url_parts.path.replace("/api/gitlab","")+"&client_id="+clientIdGitlab+"&client_secret="+apiKeyGitlab
    });
    fs.appendFile('url.txt', '\n https://api.github.com'+url_parts.path.replace("/api/gitlab",""), function (err) {
        if (err) throw err;
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


app.get('/api/clear',cache(6000), function(req, res) {

    mcache.clear()
    res.send('Cache cleared')
});
app.post("/api/form", function(req, res) {
  let result
if(req.body.lang === "sv"){
  result=req.body.options[0];
  for (let i=1;req.body.options.length > i;i++){                         
    result += (i == req.body.options.length-1) ? " och "+req.body.options[i]:", "+req.body.options[i] 
  }
  result = `<p> Tack! ${req.body.namn}, för din anmälan. <br>Du har anmält dig till ${result} <br> En bekräftelse har skickats till:<br> ${req.body.email}</p>`
}else{
  result=req.body.options[0];
  for (let i=1;req.body.options.length > i;i++){                         
    result += (i == req.body.options.length-1) ? " and "+req.body.options[i]:", "+req.body.options[i] 
  }
  result = `<p> Thanks! ${req.body.namn}, for singing up. <br>You have singed up for ${result} <br> a conformation have been sent to:<br> ${req.body.email}</p>`
}
console.log(result)
function createMailObj (to, subject, text, html){
  let obj 
  obj.from = '"Jobtechdev" <noreply@discourse.jobtechdev.se>', // sender address
  obj.to = to; // list of receivers
      obj.subject = subject; // Subject line
      obj.text = text; // plain text body
      obj.html = html; // html body
      return obj
}
  async function main() {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    ;
  
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "email-smtp.eu-central-1.amazonaws.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: mailUser, // generated ethereal user
        pass: mailPassword, // generated ethereal password
      },
    });
  
    let info = await transporter.sendMail({
      from: '"Jobtechdev" <noreply@discourse.jobtechdev.se>', // sender address
      to: "mats.lofstrand@arbetsformedlingen.se, ulrika.haggqvist@arbetsformedlingen.se", // list of receivers
      subject: "Anmälan", // Subject line
      text: req.body.namn, // plain text body
      html: "<b>"+JSON.stringify(req.body)+"</b>", // html body
    });


    // send mail with defined transport object
    let confirmation = await transporter.sendMail(createMailObj(req.body.email, "Bekräftelse på din anmälan",result,result));
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

    console.log("Message sent: %s", confirmation.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(confirmation));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  }
  
  
  let body = req.body;
  
  body.textString = result;
  main().catch(console.error);
  res.send(body)
})

app.listen(PORT, function() {
  console.log('proxify is listening on port ', PORT)
});