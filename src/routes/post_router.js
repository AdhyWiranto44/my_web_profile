const express = require('express');
const app = express();
const postController = require('../controllers/post_controller');
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


app.get("/posts", postController.index);
app.get("/post/:postSlug", postController.show);
app.get("/tag/:postTag", postController.showTag);
app.get("/admin/tambah-post-baru", postController.create);
app.get("/admin/tampil-semua-post", postController.showAdmin);
app.get("/admin/tag/:postTag", postController.showTagAdmin);
app.get("/admin/arsip-post", postController.showArchived);
app.get("/admin/mengubah-post/:postSlug", postController.modify);

app.post("/admin/tambah-post-baru", upload.single('image'), postController.store);
app.post("/admin/tampil-semua-post", postController.findAdmin);
app.post("/admin/mengarsipkan-post/:postSlug", postController.archive);
app.post("/admin/menghapus-post/:postSlug", postController.destroy);
app.post("/admin/arsip-post", postController.findArchive);
app.post("/admin/mengaktifkan-post/:postSlug", postController.activate);
app.post("/admin/mengubah-post", upload.single('image'), postController.update);


module.exports = app;