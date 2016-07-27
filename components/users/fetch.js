var User = require(global.__base + '/manager').UserModel;
var Account = require(global.__accounts_base + '/models/account');

/**
 * Fetch user accounts
 */
var fetch = function onFetch(req, res, next) {
	if (!req.params.id) return next(new Error('Missing User ID. Use the search endpoint to view more than one user'));

	User.findOne({ _id: req.params.id }, function onUsersFind(err, user) {
		if (err) return next(err);
		if (!user._id) return next(new Error('User not found'));

		Account.find({ user: user._id }, function onFind(err, account) {
			if (err) return next(err);

			return res.status(200).json({ user: user, account: account });
		});
	});
};

module.exports = fetch;
