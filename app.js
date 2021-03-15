const express = require('express');
const request = require('request');
const https = require('https');

const app = express();

app.use(express.static("public"));

app.get("/", function(req, res) {
  res.render(__dirname + '/index.ejs');
});

app.get("/portfolio", function(req, res) {
  res.send("This is portfolio page");
});

app.get("/blog", function(req, res) {
  res.send("This is blog page");
});

app.listen(process.env.PORT || 3000, function() {console.log("Server started at http://localhost:3000")});
