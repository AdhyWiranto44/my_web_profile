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

mongoose.connect(`mongodb+srv://adhywiranto44-admin:${process.env.DB_PASSWORD}@cluster0.fpapq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true});
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
  }).sort({created_at: -1});
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
  }).sort({created_at: -1})
})

app.get("/auth/login", (req, res) => {
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
})

app.post("/auth/login", (req, res) => {
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
  })
})

app.get("/auth/logout", (req, res) => {
  req.logout();
  res.redirect("/auth/login");
})

app.get("/admin/dashboard", (req, res) => {
  if (req.isAuthenticated()) {
    let jmlPost = 0;
        let postAktif = 0;
        let postArsip = 0;
    
        Post.find((err, foundPosts) => {
            if (err) {
                console.log(err);
            } else {
                jmlPost = foundPosts.length;
                foundPosts.forEach(post => {
                    if (post.active === 1) {
                        postAktif++;
                    } else {
                        postArsip++;
                    }
                })
                res.render("dashboard", {title: "Dashboard", jmlPost, postAktif, postArsip});
            }
        })
  } else {
    res.redirect("/auth/login");
  }
})

app.get("/admin/tambah-post-baru", (req, res) => {
  if (req.isAuthenticated()) {
      res.render("tambah-post-baru", {title: "Tambah Post Baru", alert: ""});
  } else {
      res.redirect('/auth/login');
  }
})

app.post("/admin/tambah-post-baru", upload.single('image'), (req, res) => {
  const title = req.body.title;
  const slug = title.replace(/\s+/g, '-').toLowerCase();
  const content = req.body.content;
  const tags = req.body.tags.split(",");
  const img = req.file.originalname;

  Post.findOne({title}, (err, foundPost) => {
      if (err) {
          console.log(err);
      } else {
          if (foundPost === null) {
              const newPost = new Post({
                  title,
                  slug,
                  content,
                  img,
                  tags,
                  author: "Admin",
                  active: 1,
                  created_at: new Date().getTime(),
                  updated_at: new Date().getTime()
              })
          
              if (title !== "" && content !== "" && tags !== "") {
                  newPost.save();
          
                  res.render("tambah-post-baru", {title: "Tambah Post Baru", alert: showAlert("alert-success", "post baru berhasil ditambahkan.")});
              } else {
                  res.render("tambah-post-baru", {title: "Tambah Post Baru", alert: showAlert("alert-warning", "data tidak boleh kosong!")});
              }
          } else {
              res.render("tambah-post-baru", {title: "Tambah Post Baru", alert: showAlert("alert-danger", "judul post sudah ada!")});
          }
      }
  })
})

app.get("/admin/tampil-semua-post", (req, res) => {
  if (req.isAuthenticated()) {
      Post.find({active: 1}, (err, foundPosts) => {
          res.render("tampil-semua-post", {title: "Tampil Semua Post", tag: "", posts: foundPosts, arrDay, arrMonth, search: "", alert: ""});
      }).sort({created_at: -1});    
  } else {
      res.redirect('/auth/login');
  }
  
})

app.post("/admin/tampil-semua-post", (req, res) => {
  const search = req.body.search;
  
  if (search === "") {
      res.redirect("/admin/tampil-semua-post");
  } else {
      Post.find({title: {$regex: ".*"+search+".*", $options: 'i'}, active: 1}, (err, foundPosts) => { // MASIH SALAH PENCARIANNYA
  
          if (err) {
              console.log(err);
          } else {
              res.render("tampil-semua-post", {title: "Search: " + search, tag: "", posts: foundPosts, arrDay, arrMonth, search, alert: ""});
          }
      })
  }
})

app.get("/admin/tag/:postTag", (req, res) => {
  if (req.isAuthenticated()) {
      const postTag = req.params.postTag;
  
      Post.find({tags: postTag}, (err, foundPosts) => {
          if (err) {
              console.log(err);
          } else {
              res.render("tampil-semua-post", {title: postTag, tag: postTag, posts: foundPosts, arrDay, arrMonth, search: "", alert: ""});
          }
      }).sort({created_at: -1})    
  } else {
      res.redirect('/auth/login');
  }
})

app.post("/admin/mengarsipkan-post/:postSlug", (req, res) => {
  const postSlug = req.params.postSlug;

  Post.findOneAndUpdate({slug: postSlug}, {active: 0}, (err, postChanged) => {
      if (err) {
          console.log(err);
      } else {
          res.redirect("/admin/tampil-semua-post");
      }
  })
})

app.post("/admin/menghapus-post/:postSlug", (req, res) => {
  const postSlug = req.params.postSlug;
  
  Post.findOne({slug: postSlug}, (err, foundPost) => {
      if (err) {
          console.log(err);
      } else {
          Post.findByIdAndRemove({_id: foundPost._id}, (err) => {
              if (err) {
                  console.log(err);
              } else {
                  res.redirect("/admin/arsip-post");
              }
          })
      }
  })
  
})

app.get("/admin/arsip-post", (req, res) => {
  if (req.isAuthenticated()) {
      Post.find({active: 0}, (err, foundPosts) => {
          res.render("arsip-post", {title: "Arsip Post", posts: foundPosts, arrDay, arrMonth, tag: "", search: "", alert: ""});
      }).sort({created_at: -1});
  } else {
      res.redirect('/auth/login');
  }
})

app.post("/admin/arsip-post", (req, res) => {
  const search = req.body.search;
  
  if (search === "") {
      res.redirect("/admin/arsip-post");
  } else {
      Post.find({title: {$regex: ".*"+search+".*", $options: 'i'}, active: 0}, (err, foundPosts) => { // MASIH SALAH PENCARIANNYA
  
          if (err) {
              console.log(err);
          } else {
              res.render("arsip-post", {title: "Search: " + search, tag: "", posts: foundPosts, arrDay, arrMonth, search, alert: ""});
          }
      })
  }
})

app.post("/admin/mengaktifkan-post/:postSlug", (req, res) => {
  const postSlug = req.params.postSlug;

  Post.findOneAndUpdate({slug: postSlug}, {active: 1}, (err, postChanged) => {
      if (err) {
          console.log(err);
      } else {
          res.redirect("/admin/arsip-post");
      }
  })
})

app.get("/admin/mengubah-post/:postSlug", (req, res) => {
  if (req.isAuthenticated()) {
      const postSlug = req.params.postSlug;
  
      Post.findOne({slug: postSlug}, (err, foundPost) => {
          if (err) {
              console.log(err);
          } else {
              res.render("ubah-post", {title: "Ubah Post", post: foundPost, alert: ""});
          }
      })
  } else {
      res.redirect('/auth/login');
  }
})

app.post("/admin/mengubah-post", upload.single('image'), (req, res) => {
  const title = req.body.title;
  const slug = req.body.slug;
  const content = req.body.content;
  const tags = req.body.tags.split(",");
  const img = req.file ? req.file.originalname : req.body.prev_img;
  const updated_at = new Date().getTime();

  Post.findOneAndUpdate({slug}, {title, content, tags, img, updated_at}, (err, postChanged) => {
      if (err) {
          console.log(err);
      } else {
          res.redirect("/admin/tampil-semua-post");
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
