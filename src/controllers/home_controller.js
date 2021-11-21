const data = require('../../data.js');


exports.index = function(req, res) {
    const ui_data = {
        title: data.full_name, data, currentDate: new Date().getFullYear()
    }
    res.render('index.ejs', ui_data);
}