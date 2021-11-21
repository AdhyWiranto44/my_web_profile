const express = require('express');
const app = express();
const authController = require('../controllers/auth_controller');


app.get("/auth/login", authController.getLogin);
app.post("/auth/login", authController.postLogin);
app.get("/auth/logout", authController.getLogout);


module.exports = app;