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
const url = require('url');
const mcache = require('memory-cache')

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

app.post("/api/form", async function (req, res) {
  let result
  let mailText

  const body = req.body;
  const lang = body.lang;
  const opts = body.options;
  const namn = body.namn;
  const mail = body.email;

  function raiseError (error) {
    console.error(error);
    body.error = error;
    res.send(body);
  }

  // Validate name
  if (/^[aA-zZäöåÄÖÅ]+$/i.test(namn)) {
    return raiseError('Namn måste vara a-ö 2-45 tecken');
  }

  // Validate mail
  if (!/^[^\s@]+@[^\s@]+$/.test(mail) || mail.length >= 45) {
    return raiseError('Tokig e-postadress');
  }

  // Escape html
  opts = opts.map(unsafe => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  });

  // ['mats', 'ulrika', 'jonas'].map(x => x.toUpperCase())
  /// ['ulrika', 'mats', 'jonas'].join('-') + '&' == ulrika-mats-jonas&
  if (lang === "sv"){
    result=opts[0];
    for (let i=1;opts.length > i;i++){                         
      result += (i == opts.length-1) ? " och "+opts[i]:", "+opts[i] 
    }
    mailText = `<p> Hej ${namn}!, Du är välkommen att ansluta till https://jitsi.jobtechdev.se/komigang/fragestund ${result}. <br> Med vänlig hälsning, JobTech Development ${mail}</p>`
    result = `<p> Tack! ${namn}, för din anmälan. <br>Du har anmält dig till ${result}. <br> En bekräftelse har skickats till:<br> ${mail}</p>`
  }else{
    result=opts[0];
    for (let i=1;opts.length > i;i++){                         
      result += (i == opts.length-1) ? " and "+opts[i]:", "+opts[i] 
    }
    mailText = `<p> Hi ${namn}!, You are welcome to join https://jitsi.jobtechdev.se/komigang/fragestund ${result}. <br> Best regards JobTech Development ${mail}</p>`
    result = `<p> Thanks! ${namn}, for singing up. <br>You have singed up for ${result}. <br> a conformation have been sent to:<br> ${mail}</p>`
  }

  function createMailObj (to, subject, body){
    const obj = new Object;

    obj.from = '"Jobtechdev" <noreply@discourse.jobtechdev.se>', // sender address
    obj.to = to; 
    obj.subject = subject; 
    obj.html = body; 

    return obj
  }

  async function main() {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    ;
  
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: "email-smtp.eu-central-1.amazonaws.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: mailUser, // generated ethereal user
        pass: mailPassword, // generated ethereal password
      },
    });

    for (let i=0; opts.length > i; i++) {
      const info = await transporter.sendMail(
        createMailObj(
          'jobtechdevelopment@arbetsformedlingen.se',
          opts[i],
          `Deltagare ${namn} <br> ${mail}`
        )
      );
    
      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou..
    }

    // send mail with defined transport object
    const confirmation = await transporter.sendMail(createMailObj(mail, "Bekräftelse på din anmälan", mailText));
  
    console.log("Message sent: %s", confirmation.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(confirmation));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  }
  
  try {
    await main();
    body.textString = result;
  } catch (err) {
    body.textString = 'Ett oväntat fel har inträffat';
  }
  
  res.send(body)
})

app.listen(PORT, function() {
  console.log('proxify is listening on port ', PORT)
});