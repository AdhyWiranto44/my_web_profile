const express = require('express');
const request = require('request');
const https = require('https');

const app = express();

app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.listen(process.env.PORT || 3000, function() {console.log("Server started at http://localhost:3000")});
