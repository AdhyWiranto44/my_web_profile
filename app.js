const express = require('express');
const request = require('request');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const https = require('https');
const data = require('./data.js');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.render(__dirname + '/index.ejs', {title: data.full_name, data, currentDate: new Date().getFullYear()});
});

app.get("/miniapp/weather", function(req, res){
  res.render("miniapp/weather", {title: "Weather"});
});

app.post('/miniapp/weather', function(req, res) {
  const query = req.body.cityName;
  console.log(query);
  const appId = '5e57594b9a1bee53ca523de19bc86273';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=${appId}`;

  // request data ke server openweathermap.org
  https.get(url, function(response) {
    console.log(response.statusCode);

    response.on("data", function(data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const weatherIcon = weatherData.weather[0].icon;
      const imageURL = `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`;

      res.write(`<h1>The temperature in ${query} is ${temp} <sup>o</sup>C</h1>`);
      res.write(`<p>The weather is currently ${weatherDescription}</p>`);
      res.write(`<img src="${imageURL}">`);
      res.send()
    });
  });
});

app.get("/miniapp/covid-19", function(req, res){
  const url = "https://covid19.mathdro.id/api/countries/indonesia";

  https.get(url, function(response) {
    console.log(response.statusCode);

    response.on("data", function(data) {
      const covidData = JSON.parse(data);

      res.render("miniapp/covid19", {data: covidData, title: "Indonesia COVID-19 Data"});
    });
  });
});

app.listen(process.env.PORT || 3000, function() {console.log("Server started at http://localhost:3000")});
