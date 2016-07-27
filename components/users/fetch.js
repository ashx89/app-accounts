var User = require(global.__base + '/manager').UserModel;
var Account = require(global.__accounts_base + '/models/account');

/**
 * Fetch user accounts
 */
var fetch = function onFetch(req, res, next) {
	var id = req.params.id;

	var usersArray = [];
	var userQuery = (id) ? { _id: id } : {};

	User.paginate(userQuery, {
		page: parseInt(req.query.page, 10) || 1,
		limit: parseInt(req.query.limit, 10) || 10
	}).then(function onPaginate(result) {
		if (!result.docs.length) return next(new Error('Users not found'));

		result.docs.forEach(function onEachUser(user, index) {
			Account.find({ user: user._id }, function onFind(err, account) {
				if (err) return next(err);

				usersArray.push({
					user: user,
					account: account,
					pagination: {
						total: result.total,
						limit: result.limit,
						page: result.page,
						pages: result.pages
					}
				});

				if (result.docs.length === index + 1) return (usersArray.length === 1) ? res.status(200).json(usersArray[0]) : res.status(200).json(usersArray);
			});
		});
	});

	// User.find(userQuery)
	// 	.limit(parseInt(req.query.limit, 10) || 10)
	// 	.sort({ lastname: 1 })
	// 	.exec(function onUsersFind(err, users) {
	// 		if (err) return next(err);
	// 		if (!users.length) return next(new Error('Users not found'));

	// 		users.forEach(function onEachUser(user, index) {
	// 			Account.find({ user: user._id }, function onFind(err, account) {
	// 				if (err) return next(err);

	// 				usersArray.push({ meta: user, account: account });

	// 				if (users.length === index + 1) return (usersArray.length === 1) ? res.status(200).json(usersArray[0]) : res.status(200).json(usersArray);
	// 			});
	// 		});
	// 	});
};

module.exports = fetch;
