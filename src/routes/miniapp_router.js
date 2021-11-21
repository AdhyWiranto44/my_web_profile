const express = require('express');
const app = express();
const miniAppController = require('../controllers/miniapp_controller');


app.get("/miniapp/weather", miniAppController.getWeather);
app.get("/miniapp/covid-19", miniAppController.getCovid);
app.post("/miniapp/weather", miniAppController.postWeather);


module.exports = app;