var _ = require('underscore');
var Account = require(global.__accounts_base + '/models/account');

/**
 * Fetch a account
 */
var fetch = function onFetch(req, res, next) {
	var query = { user: req.user._id };

	(req.params.id) ? _.extend(query, { _id: req.params.id }) : {};

	Account.find(query, function onFind(err, doc) {
		if (err) return next(err);
		if (!doc || !doc.length) return next(new Error('Account does not exist'));

		return (doc.length === 1) ? res.status(200).json(doc[0]) : res.status(200).json(doc);
	});
};

module.exports = fetch;
