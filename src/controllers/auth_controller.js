const passport = require('passport');
const User = require('../models/user');
const data = require('../../data.js');


exports.getLogin = (req, res) => {
    if (req.isAuthenticated()) {
      res.redirect('/admin/dashboard');
    } else {
      User.findOne((err, foundUser) => {
        if (err) {
            console.log(err);
        } else {
            if (foundUser === null) { // jika belum ada user yang terdaftar
              User.register({username: "adhywiranto44"}, "MinaIsMine!44", (err, user) => {
                if (err) {
                    console.log(err);
                    res.redirect('/');
                }
              })
            }
            res.render("login", {title: "Login", alert: "", data, currentDate: new Date().getFullYear()});
        }
      })
    }
}

exports.postLogin = (req, res) => {
    const user = new User({
      username: req.body.username,
      password: req.body.password
    })
  
    User.findOne({username: user.username}, (err, foundUser) => {
      if (err) {
          console.log(err);
      } else {
        if (foundUser === null) {
          res.render("login", {title: "Login", alert: showAlert("alert-danger", "username tidak terdaftar, silahkan coba lagi."), data, currentDate: new Date().getFullYear()});
        } else {
          req.login(user, (err) => {
            if (err) {
              console.log(err);
              res.redirect("/auth/login");
            } else {
              passport.authenticate('local')(req, res, function() {
                  res.redirect('/admin/dashboard');
              });
            }
          })
        }
      }
    });
}

exports.getLogout = (req, res) => {
    req.logout();
    res.redirect("/auth/login");
}