var User = require(global.__base + '/manager').UserModel;
var Account = require(global.__accounts_base + '/models/account');

/**
 * Fetch user accounts
 */
var fetch = function onFetch(req, res, next) {
	var id = req.params.id;

	var usersArray = [];
	var userQuery = (id) ? { _id: id } : {};

	User.find(userQuery, function onUsersFind(err, users) {
		if (err) return next(err);
		if (!users.length) return next(new Error('Users not found'));

		users.forEach(function onEachUser(user, index) {
			Account.find({ user: user._id }, function onFind(err, account) {
				if (err) return next(err);

				usersArray.push({ meta: user, account: account });

				if (users.length === index + 1) return (usersArray.length === 1) ? res.status(200).json(usersArray[0]) : res.status(200).json(usersArray);
			});
		});
	});
};

module.exports = fetch;
