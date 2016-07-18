global.__accounts_base = __dirname;

var express = require('express');
var multer = require('multer');

var app = express();

var uploadImage = multer().single('image');

/**
 * Rest:: Account
 */
app.get('/accounts', require('./components/users/fetch'));
app.post('/accounts', uploadImage, require('./components/users/create'));
app.patch('/accounts', uploadImage, require('./components/users/update'));

module.exports = {
	app: app,
	model: require('mongoose').model('Account')
};
