const Post = require('../models/post');
const defaultPosts = require('../helpers/default_posts');
const {arrDay, arrMonth} = require('../helpers/date');
const data = require('../../data.js');


exports.index = (req, res) => {
    Post.find({active: 1}, (err, foundPosts) => {
      if (foundPosts.length === 0) {
          Post.insertMany(defaultPosts, function(err){
              if(err) {
                  console.log(err);
              } else {
                  console.log("Data added successfully");
              }
          });
  
          res.redirect("/");
      } else {
        Post.find({active: 1}, (err, foundForTags) => {
          if (err) {
            console.log(err);
          } else {
            // Push tag di setiap post ke array,
            // Lalu hilangkan duplikat
            let allTags = [];
            foundForTags.forEach(post => {
              post.tags.forEach(tag => {
                allTags.push(tag);
              })
            })
            function onlyUnique(value, index, self) {
              return self.indexOf(value) === index;
            }
            
            allTags = allTags.filter(onlyUnique);
            res.render('posts', {title: "My Posts", data, currentDate: new Date().getFullYear(), tag: "", posts: foundPosts, arrDay, arrMonth, search: "", isAuthLink: req.isAuthenticated(), tags: allTags});
          }
        }).limit(5).sort({created_at: -1});
      }
    }).sort({created_at: -1});
}

exports.show = (req, res) => {
    const postSlug = req.params.postSlug;
  
    Post.findOne({slug: postSlug}, (err, foundPost) => {
        if (err) {
            console.log(err);
        } else {
          Post.find({active: 1}, (err, foundPosts) => {
            if (err) {
              console.log(err);
            } else {
              res.render("post-page", {title: foundPost.title, data, tag: "", currentDate: new Date().getFullYear(), otherPosts: foundPosts, currentPost: foundPost, arrDay, arrMonth, search: "", isAuthLink: req.isAuthenticated()});
            }
          }).limit(5).sort({created_at: -1});
        }
    })
}

exports.showTag = (req, res) => {
    const postTag = req.params.postTag;
  
    Post.find({tags: postTag}, (err, foundPosts) => {
        if (err) {
            console.log(err);
        } else {
          Post.find({active: 1}, (err, foundForTags) => {
            if (err) {
              console.log(err);
            } else {
              // Push tag di setiap post ke array,
              // Lalu hilangkan duplikat
              let allTags = [];
              foundForTags.forEach(post => {
                post.tags.forEach(tag => {
                  allTags.push(tag);
                })
              })
              function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
              }
              
              allTags = allTags.filter(onlyUnique);
              res.render("posts", {title: postTag, data, tag: postTag, currentDate: new Date().getFullYear(), posts: foundPosts, arrDay, arrMonth, search: "", isAuthLink: req.isAuthenticated(), tags: allTags});
            }
          });
        }
    }).sort({created_at: -1})
}

exports.create = (req, res) => {
    if (req.isAuthenticated()) {
        res.render("tambah-post-baru", {title: "Tambah Post Baru", alert: ""});
    } else {
        res.redirect('/auth/login');
    }
}

exports.store = (req, res) => {
    const title = req.body.title;
    const slug = title.replace(/[^a-zA-Z0-9-. ]/g, "").replace(/\s+/g, '-').toLowerCase();
    const content = req.body.content;
    const tags = req.body.tags.split(", ");
    const img = req.file ? req.file.originalname : "";
  
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
}

exports.showAdmin = (req, res) => {
    if (req.isAuthenticated()) {
        Post.find({active: 1}, (err, foundPosts) => {
            res.render("tampil-semua-post", {title: "Tampil Semua Post", tag: "", posts: foundPosts, arrDay, arrMonth, search: "", alert: ""});
        }).sort({created_at: -1});    
    } else {
        res.redirect('/auth/login');
    }
}

exports.findAdmin = (req, res) => {
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
}

exports.showTagAdmin = (req, res) => {
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
}

exports.archive = (req, res) => {
    const postSlug = req.params.postSlug;
  
    Post.findOneAndUpdate({slug: postSlug}, {active: 0}, (err, postChanged) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/admin/tampil-semua-post");
        }
    })
}

exports.destroy = (req, res) => {
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
}

exports.showArchived = (req, res) => {
    if (req.isAuthenticated()) {
        Post.find({active: 0}, (err, foundPosts) => {
            res.render("arsip-post", {title: "Arsip Post", posts: foundPosts, arrDay, arrMonth, tag: "", search: "", alert: ""});
        }).sort({created_at: -1});
    } else {
        res.redirect('/auth/login');
    }
}

exports.findArchive = (req, res) => {
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
}

exports.activate = (req, res) => {
    const postSlug = req.params.postSlug;
  
    Post.findOneAndUpdate({slug: postSlug}, {active: 1}, (err, postChanged) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/admin/arsip-post");
        }
    })
}

exports.modify = (req, res) => {
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
}

exports.update = (req, res) => {
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
}