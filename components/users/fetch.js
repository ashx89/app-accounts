var User = require(global.__base + '/manager').UserModel;
var Account = require(global.__accounts_base + '/models/account');

/**
 * Fetch user accounts
 */
var fetch = function onFetch(req, res, next) {
	var id = req.params.id;

	var userObject = [];
	var userQuery = (id) ? { _id: id } : {};

	User.find(userQuery)
		.limit(req.query.limit || 10)
		.sort({ lastname: 1 })
		.exec(function onUsersFind(err, users) {
			if (err) return next(err);
			if (!users.length) return next(new Error('Users not found'));

			users.forEach(function onEachUser(user) {
				Account.find({ user: user._id }, function onFind(err, account) {
					if (err) return next(err);

					userObject.push({ user: user, account: account });

					return (userObject.length === 1) ? res.status(200).json(userObject[0]) : res.status(200).json(userObject);
				});
			});
		});
};

module.exports = fetch;
