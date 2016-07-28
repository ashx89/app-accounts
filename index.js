global.__accounts_base = __dirname;

var express = require('express');
var multer = require('multer');

var app = express();

var uploadImage = multer().single('image');

/**
 * Rest:: Account
 */
app.get('/accounts/search', require('./components/accounts/search'));

app.get('/accounts', require('./components/accounts/fetch'));
app.get('/accounts/:id', require('./components/accounts/fetch'));
app.post('/accounts', uploadImage, require('./components/accounts/create'));
app.patch('/accounts', uploadImage, require('./components/accounts/update'));

module.exports = {
	app: app,
	model: require('./models/account')
};
