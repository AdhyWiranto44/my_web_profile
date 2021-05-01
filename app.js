const data = require('./data.js');

require('dotenv').config();
const express = require('express');
const request = require('request');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const https = require('https');
const mongoose = require('mongoose');

// Upload image
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/img/post')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
const upload = multer({dest: __dirname + '/public/img/post', storage})

// session dan cookies
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(`mongodb://localhost:27017/${process.env.DB_NAME}`, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useCreateIndex", true);

// DB Schema
const userSchema = new mongoose.Schema ({
  username: String,
  password: String,
  created_at: Number,
  updated_at: Number
})
userSchema.plugin(passportLocalMongoose);

const postSchema = {
  title: String,
  slug: String,
  content: String,
  img: String,
  tags: [String],
  author: String,
  active: Number,
  created_at: Number,
  updated_at: Number
}

// DB Model
const User = mongoose.model("User", userSchema);
const Post = mongoose.model("Post", postSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const arrDay = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"];
const arrMonth = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

const showAlert = function(color, message) {
  return `<div class="alert ${color} alert-dismissible fade show shadow-sm" role="alert">${message}<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>`;
}

const post1 = new Post({
  title: "Post 1",
  slug: "post-1",
  content: "Vehicula ipsum a arcu cursus vitae congue mauris rhoncus aenean. Venenatis lectus magna fringilla urna porttitor rhoncus dolor purus non. Scelerisque eleifend donec pretium vulputate sapien nec sagittis aliquam. Nullam vehicula ipsum a arcu cursus vitae congue mauris. Cum sociis natoque penatibus et magnis dis. Nunc consequat interdum varius sit amet. Quisque egestas diam in arcu cursus euismod. Scelerisque felis imperdiet proin fermentum leo. Netus et malesuada fames ac turpis egestas integer eget. Vel fringilla est ullamcorper eget nulla facilisi etiam dignissim. Id interdum velit laoreet id donec ultrices tincidunt.",
  img: "post-img.jpg",
  tags: ["nodejs", "express", "bootstrap", "todayilearn"],
  author: "Admin",
  active: 1,
  created_at: new Date().getTime(),
  updated_at: new Date().getTime()
})

const post2 = new Post({
  title: "Post 2",
  slug: "post-2",
  content: "Orci nulla pellentesque dignissim enim sit amet venenatis. Nec tincidunt praesent semper feugiat nibh sed. Nisi porta lorem mollis aliquam ut porttitor leo a. At augue eget arcu dictum varius duis at consectetur lorem. Nibh mauris cursus mattis molestie a iaculis at erat. Ut consequat semper viverra nam libero. Semper quis lectus nulla at volutpat. Rhoncus urna neque viverra justo nec ultrices dui sapien. Gravida rutrum quisque non tellus orci ac auctor augue. Felis imperdiet proin fermentum leo vel orci. Id semper risus in hendrerit gravida rutrum. Lorem donec massa sapien faucibus et molestie ac feugiat.",
  img: "",
  tags: ["blog", "react"],
  author: "Admin",
  active: 1,
  created_at: new Date().getTime(),
  updated_at: new Date().getTime()
})



app.get("/", function(req, res) {
  res.render(__dirname + '/index.ejs', {title: data.full_name, data, currentDate: new Date().getFullYear()});
});

app.get("/posts", function(req, res) {
  Post.find({active: 1}, (err, foundPosts) => {
    if (foundPosts.length === 0) {
        Post.insertMany([post1, post2], function(err){
            if(err) {
                console.log(err);
            } else {
                console.log("Data added successfully");
            }
        });

        res.redirect("/");
    } else {
        res.render('posts', {title: "My Posts", data, currentDate: new Date().getFullYear(), tag: "", posts: foundPosts, arrDay, arrMonth, search: "", isAuthLink: req.isAuthenticated()});
    }
  });
})

app.get("/post/:postSlug", (req, res) => {
  const postSlug = req.params.postSlug;

  Post.findOne({slug: postSlug}, (err, foundPost) => {
      if (err) {
          console.log(err);
      } else {
          res.render("post-page", {title: foundPost.title, data, tag: "", currentDate: new Date().getFullYear(), post: foundPost, arrDay, arrMonth, search: "", isAuthLink: req.isAuthenticated()});
      }
  })
})

app.get("/tag/:postTag", (req, res) => {
  const postTag = req.params.postTag;

  Post.find({tags: postTag}, (err, foundPosts) => {
      if (err) {
          console.log(err);
      } else {
          res.render("posts", {title: postTag, data, tag: postTag, currentDate: new Date().getFullYear(), posts: foundPosts, arrDay, arrMonth, search: "", isAuthLink: req.isAuthenticated()});
      }
  })
})

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
