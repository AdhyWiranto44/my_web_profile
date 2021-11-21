const mongoose = require('mongoose');


const dbConnect = function() {
    mongoose.connect(`mongodb+srv://adhywiranto44-admin:${process.env.DB_PASSWORD}@cluster0.fpapq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true});
    // mongoose.connect(`mongodb://localhost:27017/${process.env.DB_NAME}`, {useNewUrlParser: true, useUnifiedTopology: true});
    mongoose.set("useCreateIndex", true);
}


module.exports = dbConnect;