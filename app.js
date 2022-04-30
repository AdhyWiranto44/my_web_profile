require('dotenv').config();
const express = require('express');
const app = express();
const dbConnect = require('./src/database/db_connection');
const User = require('./src/models/user');
const mainRouter = require('./src/routes/api');
const session = require('express-session');
const passport = require('passport');


app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(mainRouter);
// dbConnect();
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.listen(process.env.PORT || 3000, function() {console.log("Server started at http://localhost:3000")});