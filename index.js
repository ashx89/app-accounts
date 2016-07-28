global.__accounts_base = __dirname;

var express = require('express');
var multer = require('multer');

var app = express();

var uploadImage = multer().single('image');

/**
 * Rest:: Account
 */
app.get('/accounts', require('./components/accounts/fetch'));
app.post('/accounts', uploadImage, require('./components/accounts/create'));
app.patch('/accounts', uploadImage, require('./components/accounts/update'));

app.get('/accounts/search', require('./components/accounts/search'));

/**
 * Rest:: Users
 */
app.get('/users/:id', require('./components/users/fetch'));

module.exports = {
	app: app,
	model: require('./models/account')
};
