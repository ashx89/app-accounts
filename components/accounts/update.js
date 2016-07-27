var _ = require('underscore');
var upload = require('app-util').upload;

/**
 * Model
 */
var Account = require(global.__accounts_base + '/models/account');

/**
 * Save the updated model
 * @param {object} account. Data fetched from the database
 */
function databaseOperation(account, req, res, next) {
	account = _.extend(account, req.body);

	account.save(function onAccountSave(err) {
		if (err) return next(err);
		return res.status(200).json(account);
	});
}

/**
 * Update an account
 */
var update = function onUpdate(req, res, next) {
	Account.findOne({ user: req.user._id }, function onFind(err, account) {
		if (err) return next(err);
		if (!account) return next(new Error('Account does not exist'));

		if (req.file) {
			upload({
				req: req,
				model: account,
				folder: 'accounts'
			}, function onImageUpload(err, result) {
				if (err) return next(err);

				req.body.image = result;
				return databaseOperation(account, req, res, next);
			});
		} else {
			return databaseOperation(account, req, res, next);
		}
	});
};

module.exports = update;
